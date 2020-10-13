<template>
  <div class="page">
    <div class="page-editor">
      <div class="editor-wrapper">
      <div class="header">
        <textarea
          v-model="title"
          rows="1"
          class="title"
          :readonly="readOnly"
          placeholder="Your Title Here"
          ref="title"
        />
        <editor-menu
          v-if="id"
          :loading="loading"
          :readonly-status="readOnly"
          @history="showHistory = true"
          @change-readonly="changeReadonlyStatus"
          @delete-document="deleteDocConfirm"/>
      </div>

      <editor
        id="editor"
        v-if="!initialize && !readOnly && !preview"
        class="content"
        :class="{ readonly: readOnly }"
        :key="`editor-${id}`"
        :content="value"
        :readonly="readOnly"
        @update-editor="onUpdateEditor"
      />
      <editor-readonly v-if="preview" :value="preview.content" />
      <editor-readonly v-else-if="readOnly" :value="value" />
      </div>
    </div>
    <div class="page-history" v-show="showHistory">
      <DocHistory ref="docHistory" :doc="doc" :preview="preview" :id="id" @close="closeHistory" @preview="showPreview" @restore="restore"></DocHistory>
    </div>

    <v-modal
      title="Delete Document"
      :visible="deleteDoc.visible"
      :loading="deleteDoc.loading"
      confirmText="Yes"
      @cancel="deleteDoc.visible = false"
      @confirm="deleteDocument(deleteDoc)"
    >
      <div class="modal-body text-center">
        Are you sure you want to delete this document?
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import config from '@/utils/config'
import { Component, Mixins, Ref, Watch } from 'vue-property-decorator'

import { DocRevisionResource, DocumentResource, NodeResource } from '@/types/resource'

import DocumentService from '@/services/document'

import Editor from '@/components/Editor.vue'
import EditorMenu from '@/components/editor/EditorMenu.vue'
import EditorReadonly from '@/components/editor/ReadOnly.vue'
import VModal from '@/components/Modal.vue'

import SpaceMixin from '@/mixins/SpaceMixin'
import PageMixin from '@/mixins/PageMixin'
import store from '@/store'
import DocHistory from '@/views/Document/DocHistory.vue'

@Component({
  name: 'Document',
  components: {
    DocHistory,
    Editor,
    EditorMenu,
    EditorReadonly,
    VModal
  }
})

export default class Document extends Mixins(SpaceMixin, PageMixin) {
  private value: any = {}
  private preview: any = null
  private title = ''
  private timer?: any = undefined
  private initialize = false
  private loading = false
  private isFromLoad = false
  private readOnly = false
  private doc: DocumentResource | null = null
  private deleteDoc: any = {
    visible: false,
    loading: false,
    id: null,
    alert: null
  }

  private showHistory = false

  get id (): number {
    return Number(this.$route.params.id) || 0
  }

  @Ref('title')
  private readonly titleRef!: HTMLInputElement

  @Ref('docHistory')
  private readonly docHistoryRef!: DocHistory

  @Watch('title')
  watchTitle () {
    clearTimeout(this.timer)
    if (this.isFromLoad) {
      this.isFromLoad = false
      return
    }

    this.timer = setTimeout(this.saveDocument, config.saveTitle * 1000)
    this.textareaResize()
  }

  @Watch('id', { immediate: true })
  async watchId (id: number) {
    this.closeHistory()
    if (this.hasNodePlaceholder()) {
      await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
    }

    if (!id) {
      this.title = ''
      this.value = {}
      if (!this.pageReady) {
        await this.activateSpace(this.currentSpaceId)
      }
      this.pageReady = true

      if (!this.hasNodePlaceholder()) {
        this.addNodePlaceholder()
      }
    } else {
      await this.loadDocument()
    }

    this.titleFocus()
    this.textareaResize()
  }

  textareaResize () {
    const title = this.titleRef

    if (title === undefined) return

    title.style.minHeight = '50px'
    if (this.title === '') return

    title.style.minHeight = title.scrollHeight + 'px'
  }

  onUpdateEditor (value: object) {
    this.value = value
    this.saveDocument()
  }

  changeReadonlyStatus (val: boolean) {
    this.readOnly = val
    this.saveDocument()
  }

  async loadDocument () {
    const id = this.$route.params.id

    if (id) {
      this.initialize = true
      try {
        this.isFromLoad = true
        const res = await DocumentService.view(id)
        const data = res.data
        this.doc = data
        this.title = data.title
        this.value = data.content
        this.readOnly = data.isLocked

        if (!this.pageReady) {
          await this.activateSpace(data.spaceId)
        }

        this.pageTitle = this.title
        this.pageReady = true
        this.$router.replace({ params: { slug: data.slug } }).catch(() => {
          // Silent duplicate error
        })
      } catch (e) {
        if (e.code === 403) {
          this.$router.push({ name: 'Main', query: { from: 'document', message: e.data.message } })
        } else {
          this.$router.replace({ name: 'Document' })
        }
      }
      this.initialize = false
    }
  }

  async saveDocument () {
    if (this.title) {
      const payload = {
        spaceId: this.activeSpace.id,
        title: this.title,
        content: this.value,
        access: 2,
        isLocked: this.readOnly
      }

      await this.createUpdateDocument(payload)
      await this.docHistoryRef.refresh()
    }
  }

  async createUpdateDocument (data: Partial<DocumentResource>) {
    try {
      const id = this.$route.params.id
      this.loading = true

      if (id) {
        await DocumentService.update(id, data)
      } else {
        const document = await DocumentService.create({ ...data, parentId: this.$store.state.document.deferredParent ? this.$store.state.document.deferredParent.id : undefined })
        const getDocument = document.data
        this.$store.commit('document/setDeferredParent', null)
        this.$router.replace({ name: 'Document', params: { id: getDocument.data.contentId } })
          .catch(() => {
            // Silent duplicate error
          })
      }

      this.loading = false
    } catch (err) {
      this.loading = false
    }
  }

  titleFocus () {
    if (!this.titleRef) {
      return
    }

    if (this.id) {
      this.titleRef.blur()
    } else {
      this.titleRef.focus()
    }
  }

  deleteDocConfirm () {
    this.deleteDoc.visible = true
    this.deleteDoc.id = this.id
  }

  async deleteDocument (data: Partial<DocumentResource>) {
    this.deleteDoc.loading = true

    try {
      await this.$store.dispatch('document/destroy', data)
      await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })

      this.$router.push({ name: 'Main' })
    } catch (err) {
      this.deleteDoc.alert = {
        type: 'danger',
        message: err.message
      }
    } finally {
      this.deleteDoc.loading = false
      this.deleteDoc.visible = false
    }
  }

  deepFindNode (parent: NodeResource[], compare: (node: NodeResource) => boolean): NodeResource | null {
    for (const node of parent) {
      if (compare(node)) {
        return node
      }
      const deepNode = this.deepFindNode(node.children, compare)
      if (deepNode) {
        return deepNode
      }
    }
    return null
  }

  addNodePlaceholder () {
    const tree = this.$store.state.tree.list.filter(
      (node: NodeResource) => !(node.type === 'doc' && node.contentId === 0)
    )

    if (this.$store.state.document.deferredParent) {
      const parent = this.deepFindNode(tree, node => node.id === this.$store.state.document.deferredParent.id) as {
        children: {
          title: string;
          type: string;
          contentId: number;
        }[];
      }
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push({
          title: 'Untitled',
          type: 'doc',
          contentId: 0
        })
      }
    } else {
      tree.push({
        title: 'Untitled',
        type: 'doc',
        contentId: 0
      })
    }

    this.$store.commit('tree/setList', tree)
  }

  hasNodePlaceholder () {
    return this.deepFindNode(this.$store.state.tree.list,
      (node: NodeResource) => (node.type === 'doc' && node.contentId === 0)
    )
  }

  mounted () {
    if (!this.id) {
      if (!this.hasNodePlaceholder()) {
        this.addNodePlaceholder()
      }

      const unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'tree/setList') {
          if (!this.hasNodePlaceholder()) {
            this.addNodePlaceholder()
            unsubscribe()
          }
        }
      })
    }

    this.titleFocus()
    this.textareaResize()
  }

  async beforeDestroy () {
    if (this.hasNodePlaceholder()) {
      this.$store.commit('document/setDeferredParent', null)
      await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
    }
  }

  closeHistory () {
    this.preview = null
    this.showHistory = false
  }

  showPreview (preview: DocRevisionResource) {
    this.preview = preview
  }

  restore (data: DocRevisionResource) {
    this.value = data.content
    this.closeHistory()
    this.saveDocument()
  }

  get currentSpaceId () {
    return store.getters['space/activeSpace'].id
  }
}
</script>

<style lang="postcss" scoped>
.page {
  @apply pt-4;
  display: flex;
  width: 0;
  flex: 1 1 auto;
}

.title {
  font-size: 2rem;
  width: 100%;
  resize: none;

  &:focus {
    outline: none;
  }
}

&::-webkit-resizer {
  display: none;
}

.header {
  @apply flex justify-between border-b-2 w-full p-0 items-center;

  border-color: theme("colors.secondary.default");
  padding-bottom: 0.5rem;
  max-width: 650px;
  margin: 0 auto;
}

.content {
  padding-top: 0.5rem;
}
.page-editor {
  flex: 1 1 auto;
  overflow: scroll;
}
.editor-wrapper {
  @apply max-w-2xl mx-auto;
}
.page-history {
  width: 256px;
  background: rgba(221, 225, 238, 0.25);
  flex: 0 0 auto;
  overflow-y: scroll;
  margin-top: -1rem;
}
</style>

<style lang="postcss">
#editor {
  &.readonly {
    .ce-toolbar__plus,
    .ce-toolbar {
      display: none;
    }
  }
}
</style>
