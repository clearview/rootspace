<template>
  <section class="file-page" @dragenter="captureDragFile" v-if="files">
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
        Files <span v-if="files.uploads">({{ files.uploads.length }})</span>
      </h3>
      <div class="actions" v-if="files.uploads && files.uploads.length > 0">
        <div class="action-group">
          <label
            class="action action--search"
            :class="{ 'action__active': searchVisible }"
            @click="searchVisible = true"
            v-click-outside="closeSearch"
          >
            <mono-icon
              name="search"
              class="action--icon"
            />

            <div
              v-if="searchVisible"
              class="action--body"
            >
              <input
                type="text"
                placeholder="Search"
                v-model="search"
                @input="lazyFetchFiles"
                @keydown.esc="clearSearch"
              >

              <button
                v-if="search"
                class="action--search--close"
                @click.stop="clearSearch"
              >
                <mono-icon name="close" />
              </button>
            </div>
          </label>
        </div>
        <div class="action-group action-group--view">
          <div
            class="action mr-3"
            :class="{ 'action--active': isList }"
            @click="viewAsList"
          >
            <legacy-icon
              name="list"
              size="20px"
              viewbox="32"
              class="icon-list mr-1"
            />
            <div class="action--body">
              List
            </div>
          </div>
          <div
            class="action"
            :class="{ 'action--active': !isList }"
            @click="viewAsGrid"
          >
            <legacy-icon
              name="grid"
              size="16px"
              viewbox="16"
              class="icon-grid mr-1"
            />
            <div class="action--body">
              Grid
            </div>
          </div>
        </div>
        <div class="action-group">
          <input type="file" ref="attachmentFile" class="attachment-file" @input="handleAttachFile" multiple>
          <button class="btn btn-upload" @click="pickFile" :disabled="isUploading" :class="{ 'uploading': isUploading }">
            <legacy-icon class="mr-2" name="plus2" size="13"  viewbox="15" />
            Upload File
          </button>
        </div>
      </div>
    </header>
    <div class="content">
      <div class="files-wrapper" v-if="files.uploads && files.uploads.length > 0">
        <FileItem :item="files" :isUploading="isUploading" :tempFile='tempFile' @deleted="refresh" />
      </div>
      <div class="empty-file" v-else>
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
import { debounce } from 'helpful-decorators'
import { Optional } from '@/types/core'
import FileItem from '@/views/Files/FileItem.vue'

import PageMixin from '@/mixins/PageMixin'
import SpaceMixin from '@/mixins/SpaceMixin'
import { FilesSettings } from '@/store/modules/files/settings'

import { FilesResource, FilesViewType } from '../../types/resource'

@Component({
  components: {
    FileItem
  }
})
export default class File extends Mixins(PageMixin, SpaceMixin) {
  @Ref('attachmentFile')
  private readonly attachmentFileRef!: HTMLInputElement

  private isUploading = false
  private isCapturingFile = false
  private isFetching = false
  private search = ''
  private searchVisible = false
  private tempFile = {}

  get id () {
    return Number(this.$route.params.id)
  }

  get files (): FilesResource | null {
    return this.$store.state.files.item
  }

  get isList (): boolean {
    return this.prefferedView === FilesViewType.List
  }

  get prefferedView (): FilesViewType {
    return this.$store.state.files.viewAs
  }

  pickFile () {
    this.attachmentFileRef.click()
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

  viewAsList () {
    this.$store.commit('files/setViewAs', 1)
  }

  viewAsGrid () {
    this.$store.commit('files/setViewAs', 2)
  }

  clearSearch () {
    this.search = ''
    this.fetchFiles()
  }

  closeSearch () {
    if (this.search) return

    this.searchVisible = false
  }

  async created () {
    await this.$nextTick()

    this.pageTitle = null
    this.pageReady = true
  }

  async refresh () {
    await this.fetchFiles()
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
      const myUploadProgress = (myFile) => (progress) => {
        const percentage = Math.floor((progress.loaded * 100) / progress.total)
        this.tempFile = {
          name: myFile.name,
          progress: percentage
        }
      }
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        const config = {
          onUploadProgress: myUploadProgress(files[i])
        }
        if (file) {
          await this.$store.dispatch('files/upload', {
            item: this.files,
            file,
            config
          })
        }
      }
      await this.fetchFiles()
      this.isUploading = false
    }
  }

  async fetchFiles () {
    this.isFetching = true
    try {
      await this.$store.dispatch('files/view', this.id)
      if (this.files) {
        if (!this.pageReady) {
          await this.activateSpace(this.files.spaceId)
        }
        this.pageTitle = this.files.title
        this.pageReady = true
      }
    } catch { }
    this.isFetching = false
  }

  @debounce(500)
  async lazyFetchFiles () {
    await this.fetchFiles()
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

.actions {
  display: flex;
  flex-flow: row;
  align-items: center;
  flex: 0 auto;
}

.action {
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  height: 32px;
  &:hover {
    background-color: #f4f5f7;
  }
  &.action--active {
    background: #444754;
    color: white;
  }
}

.action-group {
  display: flex;
  flex-flow: row;
  padding: 0 8px;
  .btn-upload {
    border-color: #8CD5FF;
    background: #8CD5FF;
    color: #2C2B35;
    padding: .3rem 1rem;
    height: 32px;
  }
  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
}

.action--search {
  &.action__active {
    width: 304px;
    box-shadow: 0 0 2px 2px #8cd5ff;
    border-radius: 4px;
    background: white;
    color: #444754;
  }

  input {
    width: 100%;
    outline: none;
  }

  .action--body {
    display: flex;
    flex-flow: row;
    position: relative;
    width: 100%;
    z-index: 110;
  }

  .action--search--close {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: #F4F5F7;
    outline: none;
    font-size: 12px;
    stroke-width: 2px;
  }
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
