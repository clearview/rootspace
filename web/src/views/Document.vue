<template>
  <layout-main>
    <div class="document-container">
      <div id="editor-toolbar">
        <input autofocus type="text" v-model="title" class="title" placeholder="Your Title Here">
        <v-icon v-if="loading" class="icon-loading" name="loading" size="2em" viewbox="100" />
      </div>

      <editor v-if="!loading" id="editor" :content="value" @update-editor="onUpdateEditor" />
    </div>
  </layout-main>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '@/utils/config'

import { DocumentResource } from '@/types/resource'

import DocumentService from '@/services/document'

import LayoutMain from '@/components/LayoutMain.vue'
import Editor from '@/components/Editor.vue'
import VIcon from '@/components/icons/Index.vue'

type ComponentData = {
  value: object;
  title: string;
  timer: undefined | number;
  loading: boolean;
}

export default Vue.extend({
  name: 'Document',
  components: {
    LayoutMain,
    Editor,
    VIcon
  },
  data (): ComponentData {
    return {
      value: {},
      title: '',
      timer: undefined,
      loading: false
    }
  },
  watch: {
    title () {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.saveDocument, config.saveInterval * 1000)
    },
    $route () {
      this.loadDocument()
    }
  },
  async mounted () {
    this.loadDocument()
  },
  methods: {
    onUpdateEditor (value: object) {
      this.value = value

      if (this.title) {
        this.saveDocument()
      }
    },
    async loadDocument () {
      const id = this.$route.params.id

      if (id) {
        this.loading = true

        try {
          const viewDoc = await DocumentService.view(id)

          this.title = viewDoc.data.title
          this.value = viewDoc.data.content
        } catch (e) {
          this.$router.replace({ name: 'Document' })
        }

        this.loading = false
      }
    },
    saveDocument () {
      if (this.title) {
        const payload = {
          spaceId: 3,
          title: this.title,
          content: this.value,
          access: 2
        }

        this.createUpdateDocument(payload)
      }
    },
    async createUpdateDocument (data: DocumentResource) {
      try {
        let document
        const id = this.$route.params.id
        this.loading = true

        if (id) {
          document = await DocumentService.update(id, data)
          this.loading = false
        } else {
          document = await DocumentService.create(data)
          const getDocument = document.data
          this.loading = false

          this.$router.replace({ name: 'Document', params: { id: getDocument.data.id } })
        }
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    }
  }
})
</script>

<style lang="postcss" scoped>
.document-container {
  @apply max-w-2xl mx-auto p-0;

  width: 43.8rem;

  .title {
    font-size: 2rem;
    width: 100%;

    &:focus {
      outline: none;
    }
  }

  #editor-toolbar {
    @apply flex justify-between border-b-2 w-full p-0;

    border-color: theme("colors.secondary.default");
    padding-bottom: .5rem;
    max-width: 650px;
    margin: 0 auto;
  }

  #editor {
    padding-top: .5rem;
  }
}
</style>
