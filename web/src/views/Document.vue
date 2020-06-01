<template>
  <div class="document-container">
    <div id="editor-toolbar">
      <input autofocus type="text" v-model="title" class="title" placeholder="Your Title Here">
      <v-icon v-if="loading" class="icon-loading" name="loading" size="2em" viewbox="100" />
    </div>

    <editor v-if="!initialize" id="editor" :content="value" @update-editor="onUpdateEditor" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '@/utils/config'

import { DocumentResource } from '@/types/resource'

import DocumentService from '@/services/document'

import Editor from '@/components/Editor.vue'

type ComponentData = {
  value: object;
  title: string;
  timer: undefined | number;
  initialize: boolean;
  loading: boolean;
  isFromLoad: boolean;
}

export default Vue.extend({
  name: 'Document',
  components: {
    Editor
  },
  data (): ComponentData {
    return {
      value: {},
      title: '',
      timer: undefined,
      initialize: false,
      loading: false,
      isFromLoad: false
    }
  },
  computed: {
    currentSpace () {
      return this.$store.state.auth.currentSpace || {}
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
    $route (newval) {
      this.initialize = true
      if (typeof newval.params.id === 'undefined') {
        this.title = ''
        this.value = {}

        setTimeout(() => {
          this.initialize = false
        }, 500)
        return
      }
      this.loadDocument()
    }
  },
  async created () {
    this.loadDocument()
  },
  methods: {
    onUpdateEditor (value: object) {
      this.value = value

      this.saveDocument()
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
    async createUpdateDocument (data: DocumentResource) {
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
        }

        this.loading = false
      } catch (err) {
        this.loading = false

        console.log(err)
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
