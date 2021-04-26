<template>
  <section class="file-page" @dragenter="captureDragFile">
    <div class="file-drag-capture" v-if="isCapturingFile" @dragover="prepareDragFile" @dragleave="releaseDragFile" @drop="processDragFile">
      <div class="file-drag-content">
        <legacy-icon
          name="upload"
          size="32px"
          viewbox="32"
        />
        Upload your file here!
      </div>
    </div>
    <header class="header">
      <h3 class="header-title">
        Files
      </h3>
    </header>
    <div class="content">
      New item {{ files }}
      <div class="empty-file">
        <div class="content">
          <img src="@/assets/images/file-empty.svg" alt="Empty File" class="illustration">
          <h3 class="title">
            Add your first file
          </h3>
          <h4 class="subtitle">
            You can drag and drop or click on the button below
          </h4>
          <div class="actions">
            <input type="file" ref="attachmentFile" class="attachment-file" @input="handleAttachFile" multiple>
            <button class="btn btn-upload" @click="pickFile" :disabled="isUploading" :class="{ 'uploading': isUploading }">
              <legacy-icon class="icon is-left" name="plus" size="1.3em" viewbox="32"/>
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Watch } from 'vue-property-decorator'
import { Optional } from '@/types/core'

import PageMixin from '@/mixins/PageMixin'
import SpaceMixin from '@/mixins/SpaceMixin'

import { FilesResource } from '../../types/resource'

@Component({
  components: {
    // EmptyFileView
  }
})
export default class File extends Mixins(PageMixin, SpaceMixin) {
  @Ref('attachmentFile')
  private readonly attachmentFileRef!: HTMLInputElement

  private isUploading = false
  private isCapturingFile = false
  private isFetching = false

  get id () {
    return Number(this.$route.params.id)
  }

  pickFile () {
    this.attachmentFileRef.click()
  }

  async created () {
    await this.$nextTick()

    this.pageTitle = null
    this.pageReady = true
  }

  captureDragFile () {
    if (!this.isUploading) {
      this.isCapturingFile = true
    }
  }

  releaseDragFile () {
    this.isCapturingFile = false
  }

  prepareDragFile (e: DragEvent) {
    e.preventDefault()
  }

  async processDragFile (e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    this.isCapturingFile = false
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      this.isUploading = true
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (file) {
          await this.$store.dispatch('files/upload', {
            item: this.files,
            file
          })
        }
      }
      this.isUploading = false
    }
  }

  async handleAttachFile () {
    const files = this.attachmentFileRef.files
    if (files) {
      this.isUploading = true
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (file) {
          await this.$store.dispatch('files/upload', {
            item: this.files,
            file
          })
        }
      }
      this.isUploading = false
    }
  }

  get files (): FilesResource | null {
    return this.$store.state.files.item
  }

  async fetchFiles () {
    this.isFetching = true
    try {
      await this.$store.dispatch('files/view', this.id)
      if (this.files) {
        if (!this.pageReady) {
          await this.activateSpace(this.files.spaceId)
        }

        this.pageReady = true
      }
    } catch { }
  }

  @Watch('id', { immediate: true })
  async watchId (id: number) {
    await this.$store.dispatch('files/view', id)
  }

  async mounted () {
    await this.fetchFiles()
  }
}
</script>

<style lang="postcss" scoped>
.content {
  @apply flex flex-col;
}

.file-page {
  @apply flex flex-col h-full relative;
  flex: 1 1 0;
  width: 0;
}

.file-drag-capture {
  @apply z-50 absolute flex flex-col;
  color: theme("colors.gray.900");
  top: 0;
  width: 100%;
  height: 100vh;
  padding: 3rem;
  background: #fff;
  .file-drag-content {
    @apply flex items-center justify-center text-3xl flex-col;
    width: 100%;
    height: 100%;
    border: 2px solid #8cd5ff;
    font-size: 16px;
    line-height: 19px;
    box-sizing: border-box;
    border-radius: 4px;
    background: #eef8ff;
    svg {
      color: #8cd5ff;
    }
  }
}

.header {
  @apply flex flex-row px-6 py-2 items-center;
  background: #ffffff;
  color: theme("colors.gray.900");
  border-bottom: solid 1px theme("colors.gray.100");
}

.header-title {
  @apply text-lg;
  flex: 1 1 auto;
}

.header-actions {
  @apply flex flex-row items-center;
  flex: 0 0 auto;
}

.attachment-file {
  @apply hidden;
}

.empty-file {
  @apply flex items-center justify-center;
  height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
  .content {
    @apply flex items-center justify-center flex-col;
    flex: 1 1 auto;
  }
  .title {
    margin-top: 56.53px;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    text-align: center;
    color: #2C2B35;
  }
  .subtitle {
    margin-top: 9px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16.71px;
    text-align: center;
    color: #2C2B35;
  }
  .actions {
    margin-top: 24px;
    .btn-upload {
      border-color: #8CD5FF;
      background: #8CD5FF;
      color: #2C2B35;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
}
</style>
