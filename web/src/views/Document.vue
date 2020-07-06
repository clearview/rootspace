<template>
  <div class="page">
    <div class="header">
      <input
        autofocus
        v-model="title"
        type="text"
        class="title"
        placeholder="Your Title Here"
        ref="title"
      >
      <v-icon
        v-if="loading"
        name="loading"
        size="2em"
        viewbox="100"
      />
    </div>

    <editor
      v-if="!initialize"
      class="content"
      :key="`editor-${id}`"
      :content="value"
      @update-editor="onUpdateEditor"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '@/utils/config'

import { DocumentResource, WorkspaceResource } from '@/types/resource'

import DocumentService from '@/services/document'

import Editor from '@/components/Editor.vue'
import { Component, Ref, Watch } from 'vue-property-decorator'

  type ComponentData = {
    value: object;
    title: string;
    timer: undefined | number;
    initialize: boolean;
    loading: boolean;
    isFromLoad: boolean;
  }

@Component({
  name: 'Document',
  components: {
    Editor
  }
})
export default class Document extends Vue {
    private value: any = {}
    private title = ''
    private timer?: any = undefined
    private initialize = false
    private loading = false
    private isFromLoad = false

    get currentSpace (): WorkspaceResource {
      return this.$store.state.auth.currentSpace || {}
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
    }

    @Watch('currentSpace')
    watchCurrentSpace (val: WorkspaceResource, oldVal: WorkspaceResource) {
      if (val.id !== oldVal.id) {
        this.$router.push({ name: 'Main' })
      }
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
    }

    onUpdateEditor (value: object) {
      this.value = value

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
        } catch (e) {
          await this.$router.replace({ name: 'Document' })
        }
        this.initialize = false
      }
    }

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
          await this.$store.dispatch('tree/fetch', { spaceId: this.currentSpace.id })
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

    mounted () {
      this.titleFocus()
    }
}
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
    @apply flex justify-between border-b-2 w-full p-0;

    border-color: theme("colors.secondary.default");
    padding-bottom: 0.5rem;
    max-width: 650px;
    margin: 0 auto;
  }

  .content {
    padding-top: 0.5rem;
  }
</style>
