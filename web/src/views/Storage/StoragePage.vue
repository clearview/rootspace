<template>
  <section
    class="page"
    @dragenter="captureDragFile"
    v-if="storageInfo && files"
  >
    <div
      class="upload-overlay"
      v-if="isCapturingFile"
      @dragover="prepareDragFile"
      @dragleave="releaseDragFile"
      @drop="handleDroppedFile"
    >
      <div class="upload-overlay--content">
        <mono-icon name="cloud-upload" class="upload-overlay--icon" />
        Upload your file here!
      </div>
    </div>

    <header class="header">
      <h3 class="header-title">
        {{ storageInfo.title }} <span>({{ files.length }})</span>
      </h3>
      <div class="actions" v-if="!isEmpty">
        <div class="action-group">
          <label
            class="action action--search"
            :class="{ action__active: searchVisible }"
            @click="searchVisible = true"
            v-click-outside="closeSearch"
          >
            <mono-icon name="search" class="action--icon" />

            <div v-if="searchVisible" class="action--body">
              <input
                type="text"
                placeholder="Search"
                v-model="search"
                @input="lazyFetchFiles"
                @keydown.esc="clearSearch"
              />

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
        <div class="action-group action-group--trash">
          <button
            class="action"
            :class="{
              'action__active': showDeletedOnly
            }"
            @click="showDeletedOnly = !showDeletedOnly"
          >
            <mono-icon name="trash" class="mr-1"/> Trash
          </button>
        </div>
        <div class="action-group">
          <div
            class="action mr-3"
            :class="{ 'action__active': isList }"
            @click="viewAsList"
          >
            <legacy-icon
              name="list"
              size="20px"
              viewbox="32"
              class="icon-list mr-1"
            />
            <div class="action--body">List</div>
          </div>
          <div
            class="action"
            :class="{ 'action__active': !isList }"
            @click="viewAsGrid"
          >
            <legacy-icon
              name="grid"
              size="16px"
              viewbox="16"
              class="icon-grid mr-1"
            />
            <div class="action--body">Grid</div>
          </div>
        </div>
        <div class="action-group">
          <input
            type="file"
            ref="attachmentFile"
            class="attachment-file"
            @input="handleSubmitFile"
            multiple
          />
          <button
            class="btn btn-upload"
            @click="pickFile"
            :disabled="isUploading"
            :class="{ uploading: isUploading }"
            v-if="!showDeletedOnly"
          >
            <legacy-icon class="mr-2" name="plus2" size="13" viewbox="15" />
            Upload File
          </button>
        </div>
      </div>
    </header>
    <div class="content">
      <loading :loading="isFetching">Loading...</loading>
      <loading :loading="isDownloading">Downloading...</loading>
      <div class="empty-file" v-if="isEmpty">
        <div class="content">
          <img
            src="@/assets/images/file-empty.svg"
            alt="Empty File"
            class="illustration"
          />
          <h3 class="title">Add your first file</h3>
          <h4 class="subtitle">
            You can drag and drop or click on the button below
          </h4>
          <div class="actions">
            <input
              type="file"
              ref="attachmentFile"
              class="attachment-file"
              @input="handleSubmitFile"
              multiple
            />
            <button
              class="btn btn-upload"
              @click="pickFile"
              :disabled="isUploading"
              :class="{ uploading: isUploading }"
            >
              <mono-icon class="icon is-left" name="plus" />
              Upload File
            </button>
          </div>
        </div>
      </div>
      <div class="files-wrapper" v-else>
        <storage-collection
          :item="files"
          :isUploading="isUploading"
          :tempItems="tempItems"
          @file:delete="handleDeleteFile"
          @file:download="handleDownloadFile"
          @file:restore="handleRestore"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Watch } from 'vue-property-decorator'
import { debounce } from 'helpful-decorators'
import { throttle } from 'lodash'
import StreamSaver from 'streamsaver'
import * as ponyfill from 'web-streams-polyfill/ponyfill'

import PageMixin from '@/mixins/PageMixin'
import SpaceMixin from '@/mixins/SpaceMixin'
import { baseURL } from '@/utils/api'

import StorageCollection from '@/views/Storage/StorageCollection.vue'
import Loading from '@/components/Loading.vue'

import {
  StorageResource,
  StorageViewType,
  NewUploadResource
} from '@/types/resource'

StreamSaver.WritableStream = ponyfill.WritableStream

@Component({
  components: {
    StorageCollection,
    Loading
  }
})
export default class File extends Mixins(PageMixin, SpaceMixin) {
  @Ref('attachmentFile')
  private readonly attachmentFileRef!: HTMLInputElement;

  private isUploading = false;
  private isDownloading = false;
  private isCapturingFile = false;
  private isFetching = false;
  private search = '';
  private searchVisible = false;
  private showDeletedOnly = false;
  private tempItems = [] as Record<string, any>[];

  get id () {
    return Number(this.$route.params.id)
  }

  get storageInfo (): StorageResource | null {
    return this.$store.state.storage.info
  }

  get files (): NewUploadResource | null {
    return this.$store.state.storage.item
  }

  get totalData (): number {
    return this.$store.state.storage.totalData
  }

  get isList (): boolean {
    return this.prefferedView === StorageViewType.List
  }

  get prefferedView (): StorageViewType {
    return this.$store.state.storage.viewAs
  }

  get isEmpty () {
    return !(this.totalData || this.tempItems.length || this.search || this.showDeletedOnly)
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
    this.$store.commit('storage/setViewAs', 1)
  }

  viewAsGrid () {
    this.$store.commit('storage/setViewAs', 2)
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

  async handleDroppedFile (e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()

    this.isCapturingFile = false
    const files = e.dataTransfer?.files

    if (files) {
      await this.uploadFiles(files)
    }
  }

  async handleSubmitFile () {
    const files = this.attachmentFileRef.files

    if (files) {
      await this.uploadFiles(files)
    }
  }

  async handleDeleteFile (id: number) {
    await this.$store.dispatch('storage/destroy', id)
    await this.fetchFiles()
  }

  async handleDownloadFile (file: NewUploadResource) {
    const url = baseURL(`/uploads/${file.id}/download`)
    const fileStream = StreamSaver.createWriteStream(file.filename)
    const config = {
      headers: {
        Authorization: `Bearer ${this.$store.state.auth.token}`
      }
    }

    this.isDownloading = true
    const res = await fetch(url, config)
    this.isDownloading = false

    if (!res.body || res.status >= 300) return

    const readableStream = res.body

    // more optimized
    if (window.WritableStream && readableStream.pipeTo) {
      return readableStream.pipeTo(fileStream)
    }

    const writer = fileStream.getWriter()
    const reader = res.body.getReader()

    async function pump (): Promise<void> {
      const res = await reader.read()

      res.done
        ? writer.close()
        : writer.write(res.value).then(pump)
    }

    await pump()
  }

  async handleRestore (file: NewUploadResource) {
    await this.$store.dispatch('storage/restore', file.id)
    await this.fetchFiles()
  }

  async uploadFiles (files: FileList) {
    if (!files) return

    this.isUploading = true

    const process = Array.from(files).map((file, index) =>
      this.$store.dispatch('storage/upload', {
        file,
        item: this.storageInfo,
        config: {
          onUploadProgress: throttle((progress: Record<string, any>) => {
            const items = [...this.tempItems]

            items[index] = {
              name: file.name,
              progress:
                Math.round((progress.loaded / progress.total) * 97) || 1
            }

            this.tempItems = items
          }, 300)
        }
      })
    )

    await Promise.all(process)
    await this.fetchFiles()

    this.isUploading = false
    this.tempItems = []
  }

  async fetchStorageInfo () {
    this.isFetching = true
    try {
      await this.$store.dispatch('storage/info', this.id)
      if (this.storageInfo && this.storageInfo.spaceId) {
        if (!this.pageReady) {
          await this.activateSpace(this.storageInfo.spaceId)
        }
        this.pageTitle = this.storageInfo.title
        this.pageReady = true
      }
    } catch {}
    this.isFetching = false
  }

  async fetchFiles () {
    this.isFetching = true
    try {
      await this.$store.dispatch('storage/fetch', {
        id: this.id,
        search: this.search,
        deleted: this.showDeletedOnly
      })
      if (this.files) {
        if (!this.pageReady) {
          await this.activateSpace(this.files.spaceId)
        }
        this.pageReady = true
      }
    } catch {}
    this.isFetching = false
  }

  @debounce(500)
  async lazyFetchFiles () {
    await this.fetchFiles()
  }

  @Watch('id', { immediate: true })
  async watchId () {
    await this.fetchStorageInfo()
    await this.fetchFiles()
  }

  @Watch('showDeletedOnly')
  @debounce(500)
  async watchDeletedOnly () {
    this.search = ''
    this.searchVisible = false

    await this.fetchFiles()
  }
}
</script>

<style lang="postcss" scoped>
.page {
  @apply flex flex-col h-full relative;
  width: 100%;
  padding: 0 72px;
}

.upload-overlay {
  @apply z-50 absolute flex flex-col;
  color: theme("colors.gray.900");
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 56px 72px;
  background: #fff;

  .upload-overlay--content {
    @apply flex items-center justify-center text-3xl flex-col;
    width: 100%;
    height: 100%;
    border: 2px solid #8cd5ff;
    font-size: 16px;
    line-height: 19px;
    box-sizing: border-box;
    border-radius: 4px;
    background: #eef8ff;
  }

  .upload-overlay--icon {
    color: #8cd5ff;
    font-size: 64px;
  }
}

.header {
  @apply flex flex-row items-center justify-between;
  padding: 18px 0;
  background: #ffffff;
  color: theme("colors.gray.900");
  border-bottom: solid 1px theme("colors.gray.100");
}

.header-title {
  font-size: 24px;
  font-weight: 700;

  span {
    font-weight: 400;
  }
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

  &.action__active {
    background: #444754;
    color: white;
  }
}

.action-group {
  display: flex;
  flex-flow: row;
  padding: 0 8px;

  .btn-upload {
    border-color: #8cd5ff;
    background: #8cd5ff;
    color: #2c2b35;
    padding: 0.3rem 1rem;
    height: 32px;
  }

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }

  &.action-group--trash {
    border: 1px solid #dee2ee;
    border-top-style: none;
    border-bottom-style: none;
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
    margin-left: 8px;
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
    background-color: #f4f5f7;
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
    color: #2c2b35;
  }
  .subtitle {
    margin-top: 9px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16.71px;
    text-align: center;
    color: #2c2b35;
  }

  .actions {
    margin-top: 24px;

    .btn {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .btn-upload {
      border-color: #8cd5ff;
      background: #8cd5ff;
      color: #2c2b35;
    }
  }
}
</style>
