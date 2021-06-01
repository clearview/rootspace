<template>
  <div
    class="file-item"
    v-if="fileCopy"
    @mouseover="showAction(index)"
    @mouseleave="showAction(null)"
    :class="{ hovered: indexHovered == index || isRenaming || isActionOpened }"
  >
    <div class="icon-thumbnail">
      <img
        :src="fileCopy.versions.preview.location"
        :alt="fileCopy.id"
        v-if="isFileImage"
      />
      <legacy-icon
        v-else
        class="stroke-0"
        size="4.1em"
        viewbox="65"
        :name="fileIcon(fileCopy.mimetype)"
      />
      <div class="download-wrapper">
        <a
          v-if="!isFileImage"
          :download="fileCopy.filename"
          target="_blank"
          class="download-file"
          @click.prevent="handleDownload(fileCopy)"
        >
          <legacy-icon name="download" size="28px" viewbox="16" />
        </a>
        <div v-else class="download-file" @click="handleFileClick(index)">
          <storageImageViewer
            v-model="fileIndex"
            :image="fileCopy"
            @close="closePreview"
            @delete="deleteFileActionConfirm()"
          />
          <legacy-icon name="download" size="28px" viewbox="16" />
        </div>
      </div>
      <Popover
        class="file-item--action"
        top="38px"
        :offset="10"
        :with-close="false"
        @trigger="handleMenuTrigger"
      >
        <template #default="{ hide }">
          <div
            class="action-line"
            @click.prevent.stop="
              copyURL(fileCopy.location);
              hide();
            "
          >
            <legacy-icon
              class="action-icon"
              name="copy"
              viewbox="16"
              size="18px"
            ></legacy-icon>
            <div class="action-line-text">Copy link</div>
          </div>
          <div
            class="action-line"
            @click.prevent.stop="
              hide();
              rename();
            "
          >
            <legacy-icon
              class="action-icon"
              name="pencil"
              viewbox="16"
              size="18px"
            ></legacy-icon>
            <div class="action-line-text">Rename</div>
          </div>
          <div class="action-separator"></div>
          <div
            class="action-line danger"
            @click.prevent.stop="
              hide();
              deleteFileActionConfirm();
            "
          >
            <legacy-icon name="archive" viewbox="16" size="18px"></legacy-icon>
            <div class="action-line-text">Delete</div>
          </div>
        </template>
        <template #trigger="{ visible }">
          <button class="btn btn-menu" :class="{ 'btn-menu--opened': visible }">
            <legacy-icon name="vertical-ellipsis" viewbox="20" size="20px" />
          </button>
        </template>
      </Popover>
    </div>
    <div class="content">
      <h3>
        <label-editable
          class="truncate"
          v-model="fileCopy.name"
          v-if="!isRenaming"
        />
      </h3>
      <div class="input-group action-button" v-show="isRenaming">
        <input
          ref="input"
          type="text"
          class="field file-input"
          placeholder="File name"
          :value="fileCopy.name"
          @keydown.enter="saveFileName"
          @keydown.esc="isRenaming = false"
        />
        <button class="btn btn-action" @click.stop="saveFileName">
          <legacy-icon
            name="checkmark3"
            viewbox="16"
            size="26px 21px"
            title="Save"
          />
        </button>
        <button class="btn btn-action" @click="isRenaming = false">
          <legacy-icon name="close" size="26px 21px" title="Cancel" />
        </button>
      </div>
      Added by {{ fileCopy.user.firstName }} {{ fileCopy.user.lastName }} •
      {{ formatDate(fileCopy.createdAt) }} •
      {{ fileCopy.size | formatFileSize }}
    </div>
    <v-modal
      title="Delete File"
      :visible="deleteFile.visible"
      confirmText="Yes"
      @cancel="deleteFile.visible = false"
      @confirm="deleteFileAction(fileCopy)"
      portal="secondary"
    >
      <div class="modal-body text-center">
        Are you sure you want to delete this file?
        <span class="font-semibold">{{ fileCopy.name }}</span>
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'
import { NewUploadResource } from '@/types/resource'

import VModal from '@/components/legacy/Modal.vue'
import Popover from '@/components/Popover.vue'
import LabelEditable from '@/components/LabelEditable.vue'
import StorageImageViewer from '@/components/StorageImageViewer.vue'
import moment from 'moment'

@Component({
  name: 'StorageGridItem',
  components: {
    Popover,
    LabelEditable,
    VModal,
    StorageImageViewer
  },
  filters: {
    formatFileSize (num: number) {
      if (typeof num !== 'number' || isNaN(num)) {
        throw new TypeError('Expected a number')
      }

      const neg = num < 0
      const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      if (neg) {
        num = -num
      }

      if (num < 1) {
        return (neg ? '-' : '') + num + ' B'
      }

      const exponent = Math.min(
        Math.floor(Math.log(num) / Math.log(1000)),
        units.length - 1
      )
      num = +(num / Math.pow(1000, exponent)).toFixed(2) * 1
      const unit = units[exponent]

      return (neg ? '-' : '') + num + ' ' + unit
    }
  }
})
export default class StorageGridView extends Vue {
  @Prop({ type: Object, required: true })
  private readonly file!: NewUploadResource;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Ref('input')
  private readonly inputRef!: HTMLInputElement;

  private indexHovered = 0;
  private isRenaming = false;
  private isActionOpened = false;
  private fileCopy = { ...this.file };
  private fileIndex: number | null = null;
  private deleteFile: any = {
    visible: false,
    id: null,
    alert: null
  };

  get isFileImage () {
    return (
      ['image/jpg', 'image/jpeg', 'image/png'].indexOf(
        this.fileCopy.mimetype
      ) !== -1
    )
  }

  showAction (value: number) {
    this.indexHovered = value
  }

  handleFileClick (index: number | null) {
    this.fileIndex = index
  }

  closePreview () {
    this.fileIndex = null
  }

  handleMenuTrigger (visible: boolean) {
    if (visible) {
      this.isActionOpened = true
    } else {
      this.isActionOpened = false
    }
  }

  deleteFileActionConfirm () {
    this.closePreview()
    this.deleteFile.visible = true
  }

  async deleteFileAction (file: NewUploadResource) {
    this.deleteFile.visible = false
    this.$emit('delete', file.id)
  }

  formatDate (fileDate: Date | string) {
    return moment(fileDate).format('MMM DD, YYYY')
  }

  fileIcon (type: string) {
    switch (type) {
      case 'application/pdf':
        return 'filePdf'
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'fileDocx'
      default:
        return 'fileDefault'
    }
  }

  rename () {
    this.isRenaming = true
    Vue.nextTick(() => {
      this.inputRef.focus()
    })
  }

  async saveFileName () {
    const title = this.inputRef.value
    if (title.trim().length === 0) {
      this.isRenaming = false
    } else {
      this.fileCopy.name = title.replace(/\s+/g, '-').replace(/\.[^/.]+$/, '')
      this.fileCopy.filename = title.replace(/\s+/g, '-')
      await this.$store.dispatch('storage/update', {
        id: this.fileCopy.id,
        data: {
          name: this.fileCopy.name,
          filename: this.fileCopy.filename
        }
      })
      this.isRenaming = false
    }
  }

  async copyURL (url: string) {
    await navigator.clipboard.writeText(url) // TODO : Add a feedback if the URL is copied
  }

  handleDownload (file: NewUploadResource) {
    this.$emit('download', file)
  }

  @Watch('file')
  watchFile (file: NewUploadResource) {
    this.fileCopy = { ...file }
  }
}
</script>

<style lang="postcss" scoped>
.file-item {
  @apply flex flex-col;
  border: 1px solid #dee2ee;
  border-radius: 4px;
  &.hovered {
    background: #f8f8fb;
    .download-wrapper,
    .file-item--action {
      display: flex;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
}
.download-wrapper {
  @apply flex-wrap justify-center content-center w-full h-full absolute;
  display: none;
  background: #f8f8fb;
  .download-file {
    /* TODO : Change download icon color */
    background: #ddf3ff;
    padding: 16px 40px;
    border-radius: 34px;
    cursor: pointer;
  }
}
.file-item--action {
  display: none;
}
.input-group {
  border: 0;
  &.action-button {
    .btn-action {
      width: 32px;
      height: 32px;
      padding: 2px;
      border-radius: 50%;
      background-color: transparent;
      border: none;
      &:hover {
        background-color: #d4ecfa;
      }
    }
  }
}
.file-input {
  flex-grow: 1;
  outline: none;
  padding: 5px 4px 6px 4px;
  margin-right: 10px;
  font-weight: 500;
  line-height: 0;
  color: #2c2b35;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #aab1c5;
  height: 32px;
}
.action-wrapper {
  @apply absolute;
  display: none;
  top: -10px;
  right: -10px;
}
.icon-thumbnail {
  @apply flex flex-wrap justify-center content-center relative;
  height: 150px;
  img {
    @apply rounded-t;
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
}
.content {
  @apply p-5;
}
h3 {
  @apply truncate;
  font-size: 1rem;
  font-weight: bold;
}
.action-line {
  .action-icon {
    fill: none;
    stroke-width: 1.5px;
  }
}
.popover-container {
  @apply absolute;
  top: -16px;
  right: 18px;
}
.btn-menu {
  height: auto;
  padding: 5px;
  background: white;
  border: 1px solid #aab1c5 !important;
  border-radius: 4px;
  &:focus {
    box-shadow: none;
  }
  &.btn-menu--opened {
    background: #ddf3ff;
    border: 1px solid #ddf3ff !important;
    box-shadow: none;
    svg {
      fill: #146493;
    }
  }
}
.action-line {
  @apply flex items-center py-2 px-4 my-1 relative;
  font-size: 13px;
  width: 168px;
  color: theme("colors.gray.900");
  stroke-width: 3px;
  cursor: pointer;
  &:hover {
    background: #f0f2f5;
    .action-submenu {
      visibility: visible;
      opacity: 1;
    }
  }
  &.danger {
    color: theme("colors.danger.default");
  }
}
.action-line-text {
  @apply ml-2;
  flex: 1 1 auto;
}
.action-separator {
  @apply my-1;
  height: 1px;
  background: theme("colors.gray.100");
}
</style>
