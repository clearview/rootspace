<template>
  <div class="doc">
    <div class="doc-header">
      <input
        autofocus
        type="text"
        v-model="title"
        class="doc-title"
        placeholder="Your Title Here"
      >
      <v-icon
        v-show="loading"
        class="icon-loading"
        name="loading"
        size="2em"
        viewbox="100"
      />
    </div>

    <editor
      v-if="!initialize"
      class="doc-content"
      v-model="value"
      @input="onUpdateEditor"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '@/utils/config'

import { DocumentResource } from '@/types/resource'

import DocumentService from '@/services/document'

import Editor from '@/components/Editor.vue'

type ComponentData = {
  value: EditorJS.OutputData;
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
      value: {
        blocks: []
      },
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
    },
    titleInput (): HTMLInputElement {
      return this.$refs.titleInput as HTMLInputElement
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
        this.value = { blocks: [] }

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
  mounted () {
    this.titleInput.focus()
  },
  beforeRouteUpdate (to, from, next) {
    this.titleInput.focus()

    return next()
  },
  methods: {
    onUpdateEditor (value: EditorJS.OutputData) {
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
        const payload: DocumentResource = {
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
      }
    }
  }
})
</script>

<style lang="postcss" scoped>
.doc {
  @apply w-full mx-auto p-0;

  max-width: 700px;
}

.doc-header {
  @apply flex justify-between items-center;
  @apply border-b;
  @apply pt-2 px-0 pb-6;
  @apply my-0;

  border-color: #DEE2EE;
}

.doc-title {
  font-size: 2rem;
  width: 100%;

  &:focus {
    outline: none;
  }
}

.doc-content {
  @apply pt-6;
}
</style>
