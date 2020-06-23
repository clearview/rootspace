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

    <div v-if="readOnly" class="editor content">
      <div class="codex-editor" v-html="valueEditor"></div>
    </div>

    <v-modal
      title="Delete Document"
      :visible="deleteDoc.visible"
      :loading="deleteDoc.loading"
      confirmText="Yes"
      @cancel="deleteDoc.visible = false"
      @confirm="deleteDocument(id)"
    >
      <div class="modal-body text-center">
        Are you sure you want to delete this document?
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '@/utils/config'
import readOnly from '@/utils/editor/readOnly'

import { DocumentResource, WorkspaceResource } from '@/types/resource'

import DocumentService from '@/services/document'

import Editor from '@/components/Editor.vue'
import EditorMenu from '@/components/editor/EditorMenu.vue'
import VModal from '@/components/Modal.vue'

type Alert = {
  type: string;
  message: string;
};

type ComponentData = {
  value: object;
  valueEditor: string;
  title: string;
  timer: undefined | number;
  initialize: boolean;
  loading: boolean;
  isFromLoad: boolean;
  readOnly: boolean;
  deleteDoc: {
    visible: boolean;
    loading: boolean;
    data: number | null;
    alert: Alert | null;
  };
}

export default Vue.extend({
  name: 'Document',
  components: {
    Editor,
    EditorMenu,
    VModal
  },
  data (): ComponentData {
    return {
      value: {},
      valueEditor: '',
      title: '',
      timer: undefined,
      initialize: false,
      loading: false,
      isFromLoad: false,
      readOnly: false,
      deleteDoc: {
        visible: false,
        loading: false,
        data: null,
        alert: null
      }
    }
  },
  computed: {
    currentSpace (): WorkspaceResource {
      return this.$store.state.auth.currentSpace || {}
    },
    id (): number {
      return Number(this.$route.params.id) || 0
    },
    refs: {
      cache: false,
      get (this: Vue) {
        return {
          title: this.$refs.title as HTMLInputElement
        }
      }
    }
  },
  watch: {
    title () {
      clearTimeout(this.timer)
      if (this.isFromLoad) {
        this.isFromLoad = false
        return
      }
      this.timer = setTimeout(this.saveDocument, config.saveTitle * 1000)
      this.textareaResize()
    },
    currentSpace (val, oldVal) {
      if (val.id !== oldVal.id) {
        this.$router.push({ name: 'Main' })
      }
    },
    id: {
      immediate: true,
      async handler (id) {
        if (!id) {
          this.title = ''
          this.value = {}
        } else {
          await this.loadDocument()
        }

        this.titleFocus()
        this.textareaResize()
      }
    }
  },
  mounted () {
    this.titleFocus()
    this.textareaResize()
  },
  methods: {
    textareaResize () {
      const title = this.$refs.title as HTMLInputElement

      if (title === undefined) return

      title.style.minHeight = '50px'
      if (this.title === '') return

      title.style.minHeight = title.scrollHeight + 'px'
    },
    onUpdateEditor (value: object) {
      this.value = value

      this.saveDocument()
    },
    changeReadonlyStatus (val: boolean) {
      this.readOnly = val

      // const elements = document.querySelectorAll(`[contenteditable=${val}]`)
      // const state = !val
      // elements.forEach(element => {
      //   element.setAttribute('contenteditable', state.toString())
      // })

      if (val) {
        console.log(this.value)
        this.valueEditor = readOnly(this.value)
      }
    },
    async loadDocument () {
      const id = this.$route.params.id

      if (id) {
        this.initialize = true
        try {
          this.isFromLoad = true
          const viewDoc = await DocumentService.view(id)

          this.title = viewDoc.data.title
          this.value = viewDoc.data.content
        } catch (e) {
          this.$router.replace({ name: 'Document' })
        }
        this.initialize = false
      }
    },
    saveDocument () {
      if (this.title) {
        const payload = {
          spaceId: this.currentSpace.id,
          title: this.title,
          content: this.value,
          access: 2
        }

        this.createUpdateDocument(payload)
      }
    },
    async createUpdateDocument (data: Partial<DocumentResource>) {
      try {
        let document
        const id = this.$route.params.id
        this.loading = true

        if (id) {
          document = await DocumentService.update(id, data)
        } else {
          document = await DocumentService.create(data)
          const getDocument = document.data

          this.$router.replace({ name: 'Document', params: { id: getDocument.data.id } })
          await this.$store.dispatch('tree/fetch', { spaceId: this.currentSpace.id })
        }

        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    titleFocus () {
      if (!this.refs.title) {
        return
      }

      if (this.id) {
        this.refs.title.blur()
      } else {
        this.refs.title.focus()
      }
    },
    deleteDocConfirm () {
      this.deleteDoc.visible = true
    },
    async deleteDocument (id: number) {
      this.deleteDoc.loading = true

      try {
        await DocumentService.destroy(id)

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
  }
})
</script>

<style lang="postcss" scoped>
.page {
  @apply max-w-2xl mx-auto p-0;

  width: 43.8rem;

}

.title {
  font-size: 2rem;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::-webkit-resizer {
    display: none;
  }
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
