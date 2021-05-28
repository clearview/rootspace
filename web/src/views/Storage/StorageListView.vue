<template>
  <div
    v-if="fileCopy"
    class="file-item"
    @mouseover="showAction(index)"
    @mouseleave="showAction(null)"
    :class="{ 'hovered' : indexHovered == index || isRenaming || isActionOpened }">
    <div class="file-item--thumbnail" v-if="isFileImage">
      <storageImageViewer v-model="fileIndex" :image="fileCopy.location" @close="closePreview" @delete="deleteFileActionConfirm()" />
      <img :src="fileCopy.location" :alt="fileCopy.id" @click="handleFileClick(index)">
    </div>
    <div class="file-item--icon" v-else>
      <legacy-icon class="stroke-0" size="4.1em" viewbox="65" :name="fileIcon(fileCopy.mimetype)" />
    </div>
    <div class="file-item--content">
      <h3>
        <label-editable
          class="truncate"
          v-model="fileCopy.name"
          v-if="!isRenaming"
        />
      </h3>
      <div class="input-group action-button" v-show="isRenaming">
        <input ref="input" type="text" class="field file-input" placeholder="File name" :value="fileCopy.name"
          @keydown.enter="saveFileName" @keydown.esc="isRenaming = false">
        <button class="btn btn-action" @click.stop="saveFileName">
          <legacy-icon name="checkmark3" viewbox="16" size="26px 21px" title="Save"/>
        </button>
        <button class="btn btn-action" @click="isRenaming = false">
          <legacy-icon name="close" size="26px 21px" title="Cancel"/>
        </button>
      </div>
      <div v-if="!isRenaming">
        Added by {{ fileCopy.user.firstName }} {{ fileCopy.user.lastName }} • {{ formatDate(fileCopy.createdAt) }} • {{ fileCopy.size | formatFileSize }}
      </div>
    </div>
    <a :href="fileCopy.location" :download="fileCopy.filename" target="_blank" class="download-file">
      <legacy-icon class="action-icon" name="download" viewbox="19" size="19px"></legacy-icon>
    </a>
    <Popover
      class="file-item--action"
      top="38px"
      :offset="10"
      :with-close="false"
      @trigger="handleMenuTrigger">
      <template #default="{ hide }">
        <div class="action-line" @click.prevent.stop="copyURL(fileCopy.location);hide();">
          <legacy-icon class="action-icon" name="copy" viewbox="16" size="18px"></legacy-icon>
          <div class="action-line-text">Copy link</div>
        </div>
        <div class="action-line" @click.prevent.stop="hide();rename();">
          <legacy-icon class="action-icon" name="pencil" viewbox="16" size="18px"></legacy-icon>
          <div class="action-line-text">Rename</div>
        </div>
        <div class="action-separator"></div>
        <div class="action-line danger" @click.prevent.stop="hide();deleteFileActionConfirm();">
          <legacy-icon name="archive" viewbox="16" size="18px"></legacy-icon>
          <div class="action-line-text">
            Delete
          </div>
        </div>
      </template>
      <template #trigger="{ visible }">
        <button class="btn btn-menu" :class="{'btn-menu--opened': visible}">
          <legacy-icon name="vertical-ellipsis" viewbox="20" size="20px"/>
        </button>
      </template>
    </Popover>
    <v-modal
      title="Delete File"
      :visible="deleteFile.visible"
      confirmText="Yes"
      @cancel="deleteFile.visible = false"
      @confirm="deleteFileAction(fileCopy)"
      portal="secondary"
    >
      <div class="modal-body text-center">
        Are you sure you want to delete this file? <span class="font-semibold">{{ fileCopy.name }}</span>
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'
import { NewUploadResource } from '@/types/resource'
import moment from 'moment'
import VModal from '@/components/legacy/Modal.vue'
import Popover from '@/components/Popover.vue'
import LabelEditable from '@/components/LabelEditable.vue'
import StorageImageViewer from '@/components/StorageImageViewer.vue'

@Component({
  name: 'StorageListView',
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

      const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
      num = +(num / Math.pow(1000, exponent)).toFixed(2) * 1
      const unit = units[exponent]

      return (neg ? '-' : '') + num + ' ' + unit
    }
  }
})

export default class StorageListView extends Vue {
  @Prop({ type: Object, required: true })
  private readonly file!: NewUploadResource

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Ref('input')
  private readonly inputRef!: HTMLInputElement;

  private indexHovered = 0
  private isRenaming = false
  private isActionOpened = false
  private fileCopy = { ...this.file }
  private fileIndex: number|null = null
  private deleteFile: any = {
    visible: false,
    id: null,
    alert: null
  }

  get isFileImage () {
    return ['image/jpg', 'image/jpeg', 'image/png'].indexOf(this.fileCopy.mimetype) !== -1
  }

  showAction (value: number) {
    this.indexHovered = value
  }

  handleFileClick (index: number|null) {
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

  @Watch('file')
  watchFile (file: NewUploadResource) {
    this.fileCopy = { ...file }
  }
}
</script>

<style lang="postcss" scoped>
h3 {
  @apply mb-2;
  font-size: 1rem;
  font-weight: bold;
}
.file-item {
  @apply flex flex-row p-5 items-center relative;
  border-bottom: 1px solid #F8F8FB;
  padding-right: 80px;
  &.hovered {
    border-radius: 4px;
    background: #F8F8FB;
    border-bottom: 1px solid #F8F8FB;
    .file-item--action {
      display: flex;
    }
  }
}
.file-item--thumbnail {
  cursor: pointer;
  @apply mr-6;
  img {
    @apply rounded;
    width: 57px;
    height: 44px;
    object-fit: cover;
  }
}
.file-item--icon {
  @apply mr-6;
}
.file-item--content {
  @apply flex flex-col mr-auto w-full;
  font-size: .813rem;
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
  margin-right: 30px;
  font-weight: 500;
  line-height: 0;
  color: #2C2B35;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #AAB1C5;
  height: 32px;
}
.download-file {
  background: #EDEFF3;
  padding: 12.5px 20px;
  border-radius: 24px;
  &:hover {
    background: #DDF3FF;
  }
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
  border: 1px solid #AAB1C5 !important;
  border-radius: 4px;
  &:focus {
    box-shadow: none;
  }
  &.btn-menu--opened {
    background: #DDF3FF;
    border: 1px solid #DDF3FF !important;
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
  &:hover{
    background: #F0F2F5;
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
.action-separator{
  @apply my-1;
  height:1px;
  background: theme("colors.gray.100");
}
</style>
