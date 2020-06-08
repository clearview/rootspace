<template>
  <editor
    v-if="ready"
    v-model="payload"
    :key="editorKey"
    :loading="loading"
    @input="save"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'

import { DocumentResource } from '@/types/resource'

import DocumentService from '@/services/document'

import Editor from '@/components/Editor.vue'

type ComponentData = {
  ready: boolean;
  loading: boolean;
  payload: Partial<DocumentResource> | null;
}

export default Vue.extend({
  name: 'Document',
  components: {
    Editor
  },
  data (): ComponentData {
    return {
      ready: false,
      loading: false,
      payload: null
    }
  },
  computed: {
    id (): number {
      return Number(this.$route.params.id) || 0
    },
    currentSpace () {
      return this.$store.state.auth.currentSpace || {}
    },
    editorKey (): string {
      return `document-${this.id}`
    },
    saveInterval () {
      return Number(process.env.VUE_APP_SAVE_INTERVAL) || 500
    }
  },
  watch: {
    id: {
      immediate: true,
      async handler (id) {
        this.ready = false
        this.payload = {
          title: '',
          spaceId: this.currentSpace.id,
          access: 2,
          content: {
            blocks: []
          }
        }

        if (id) {
          await this.fetch()
        }

        this.ready = true
      }
    }
  },
  methods: {
    async fetch () {
      this.loading = true

      try {
        const { data } = await DocumentService.view(this.id)

        this.payload = data
      } finally {
        this.loading = false
      }
    },
    async save () {
      if (!this.payload) {
        return
      }

      this.loading = true

      try {
        if (this.id) {
          await DocumentService.update(this.id, this.payload)
        } else {
          const { data } = await DocumentService.create(this.payload)

          this.$router.replace({
            name: 'Document',
            params: {
              id: data.id
            }
          })
        }
      } finally {
        this.loading = false
      }
    }
  },
  async created () {
    this.save = debounce(
      this.save.bind(this),
      this.saveInterval
    )
  }
})
</script>
