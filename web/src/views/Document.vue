<template>
  <div class="page">
    <div class="header">
      <textarea-autosize
        autofocus
        v-model="title"
        rows="1"
        class="title"
        placeholder="Your Title Here"
        ref="title"
        :min-height="50"
      />
      <editor-menu :loading="loading" @change-readonly="changeReadonlyStatus" />
    </div>

    <editor
      id="editor"
      v-if="!initialize"
      class="content"
      :key="`editor-${id}`"
      :content="value"
      @update-editor="onUpdateEditor"
      :read-only="readOnly"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '@/utils/config'

import { DocumentResource, WorkspaceResource } from '@/types/resource'

import DocumentService from '@/services/document'

import Editor from '@/components/Editor.vue'
import EditorMenu from '@/components/editor/EditorMenu.vue'

type ComponentData = {
  value: object;
  title: string;
  timer: undefined | number;
  initialize: boolean;
  loading: boolean;
  isFromLoad: boolean;
  readOnly: boolean;
}

export default Vue.extend({
  name: 'Document',
  components: {
    Editor,
    EditorMenu
  },
  data (): ComponentData {
    return {
      value: {},
      title: '',
      timer: undefined,
      initialize: false,
      loading: false,
      isFromLoad: false,
      readOnly: true
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
      }
    }
  },
  methods: {
    onUpdateEditor (value: object) {
      this.value = value

      this.saveDocument()
    },
    changeReadonlyStatus (value: boolean) {
      console.log('onChangeReadOnly', value)

      this.readOnly = value
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
    }
  },
  mounted () {
    this.titleFocus()
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
