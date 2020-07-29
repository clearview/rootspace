<template>
  <div class="page">
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
        @change-readonly="changeReadonlyStatus"
        @delete-document="deleteDocConfirm"/>
    </div>

    <editor
      id="editor"
      v-if="!initialize && !readOnly"
      class="content"
      :class="{ readonly: readOnly }"
      :key="`editor-${id}`"
      :content="value"
      :readonly="readOnly"
      @update-editor="onUpdateEditor"
    />

    <editor-readonly v-if="readOnly" :value="value" />

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
import { Component, Ref, Watch, Mixins } from 'vue-property-decorator'

import { DocumentResource } from '@/types/resource'

import DocumentService from '@/services/document'

import Editor from '@/components/Editor.vue'
import EditorMenu from '@/components/editor/EditorMenu.vue'
import EditorReadonly from '@/components/editor/ReadOnly.vue'
import VModal from '@/components/Modal.vue'

import SpaceMixin from '@/mixins/SpaceMixin'

@Component({
  name: 'Document',
  components: {
    Editor,
    EditorMenu,
    EditorReadonly,
    VModal
  }
})

export default class Document extends Mixins(SpaceMixin) {
  private value: any = {}
  private title = ''
  private timer?: any = undefined
  private initialize = false
  private loading = false
  private isFromLoad = false
  private readOnly = false
  private deleteDoc: any = {
    visible: false,
    loading: false,
    id: null,
    alert: null
  }

  get id (): number {
    return Number(this.$route.params.id) || 0
  }

  @Ref('title')
  private readonly titleRef!: HTMLInputElement

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
    if (!id) {
      this.title = ''
      this.value = {}
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
        const viewDoc = await DocumentService.view(id)

        this.title = viewDoc.data.title
        this.value = viewDoc.data.content
        this.readOnly = viewDoc.data.isLocked

        this.setActiveSpace(viewDoc.data.spaceId, {
          activePage: this.$route.path
        })
      } catch (e) {
        this.$router.replace({ name: 'Document' })
      }
      this.initialize = false
    }
  }

  saveDocument () {
    if (this.title) {
      const payload = {
        spaceId: this.activeSpace.id,
        title: this.title,
        content: this.value,
        access: 2,
        isLocked: this.readOnly
      }

      this.createUpdateDocument(payload)
    }
  }

  async createUpdateDocument (data: Partial<DocumentResource>) {
    try {
      const id = this.$route.params.id
      this.loading = true

      if (id) {
        await DocumentService.update(id, data)
      } else {
        const document = await DocumentService.create(data)
        const getDocument = document.data
        this.$router.replace({ name: 'Document', params: { id: getDocument.data.id } })
        await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
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

  mounted () {
    this.titleFocus()
    this.textareaResize()
  }
}
</script>

<style lang="postcss" scoped>
  .page {
    @apply max-w-2xl mx-auto pt-4;

    width: 43.8rem;

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
