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
      <emptyFileView />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Prop } from 'vue-property-decorator'

import PageMixin from '@/mixins/PageMixin'
import SpaceMixin from '@/mixins/SpaceMixin'

import EmptyFileView from '@/views/Files/EmptyFile.vue'
import { FilesResource } from '../../types/resource'

@Component({
  components: {
    EmptyFileView
  }
})
export default class File extends Mixins(PageMixin, SpaceMixin) {
  @Ref('attachmentFile')
  private readonly attachmentFileRef!: HTMLInputElement

  private isUploading = false
  private isCapturingFile = false

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
            item: 'tes',
            file
          })
        }
      }
      this.isUploading = false
    }
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
</style>
