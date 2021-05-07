<template>
  <div class="grid grid-cols-1" v-if="file">
    <div class="file-item"
         v-for="(file, index) in file.uploads"
         :key="index"
         @mouseover="showAction(index)"
         @mouseleave="showAction(null)"
         :class="{ 'hovered' : indexHovered == index }">
      <div class="file-item--icon">
        <legacy-icon class="stroke-0" size="4.1em" viewbox="65" :name="fileIcon(file.mimetype)" />
      </div>
      <div class="file-item--content">
        <h3>{{ file.filename }}</h3>
        <h3>
          <label-editable
            class="truncate"
            v-model="file.filename"
            v-if="!isRenaming"
          />
          <input ref="input" type="text" class="field node-input" v-show="isRenaming" placeholder="Node name" :value="file.filename"
            @keydown.enter="$event.target.blur()" @keydown.esc="isRenaming = false">
        </h3>
        Added by • {{ formatDate(file.createdAt) }} • {{ file.size | formatFileSize }}
      </div>
      <div class="file-item--action">
        <div class="download-file" @click="downloadFile(file.location)">
          <legacy-icon class="action-icon" name="download" viewbox="19" size="19px"></legacy-icon>
        </div>
      </div>
      <Popover
        class="flex"
        top="38px"
        :offset="10"
        :with-close="false"
        @mouseover="showAction(index)"
        @mouseleave="showAction(null)"
        @trigger="handleMenuTrigger">
        <template #default="{ hide }">
          <div class="action-line" @click.prevent.stop="copyURL(file.location);hide();">
            <legacy-icon class="action-icon" name="copy" viewbox="16" size="18px"></legacy-icon>
            <div class="action-line-text">Copy link</div>
          </div>
          <div class="action-line" @click.prevent.stop="hide();rename();">
            <mono-icon class="action-icon" name="pencil"/>
            <div class="action-line-text">Rename</div>
          </div>
          <div class="action-separator"></div>
          <div class="action-line danger">
            <legacy-icon name="archive" viewbox="16" size="18px"></legacy-icon>
            <div class="action-line-text">
              Archive
            </div>
          </div>
        </template>
        <template #trigger="{ visible }">
          <button class="btn btn-menu" :class="{'btn-link-primary': visible}">
            <legacy-icon name="vertical-ellipsis" viewbox="20" size="1.25rem"/>
          </button>
        </template>
      </Popover>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'vue-property-decorator'
import { FilesResource } from '@/types/resource'
import moment from 'moment'
import Popover from '@/components/Popover.vue'
import LabelEditable from '@/components/LabelEditable.vue'

@Component({
  name: 'FileListView',
  components: {
    Popover,
    LabelEditable
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

export default class FileListView extends Vue {
  private indexHovered = null
  private isRenaming = false

  @Prop({ type: Object, required: true })
  private readonly file!:FilesResource

  @Ref('input')
  private readonly inputRef!: HTMLInputElement;

  showAction (value: number) {
    this.indexHovered = value
  }

  handleMenuTrigger (visible: boolean) {
    if (visible) {
      this.$emit('drag:disable')
    } else {
      this.$emit('drag:enable')
    }
  }

  formatDate (fileDate: Date | string) {
    return moment(fileDate).format('MMM DD, YYYY')
  }

  downloadFile (url: string) {
    window.open(url, '_blank')
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

  async copyURL (url: string) {
    await navigator.clipboard.writeText(url) // TODO : Add a feedback if the URL is copied
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
  &.hovered {
    border-radius: 4px;
    background: #F8F8FB;
    border-bottom: 1px solid #F8F8FB;
  }
}
.file-item--icon {
  @apply mr-6;
}
.file-item--content {
  font-size: .813rem;
}
.file-item--action {
  @apply flex ml-auto;
  padding-right: 80px;
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
}
.action-line {
  @apply flex items-center py-2 px-4 my-1 relative;
  font-size: 13px;
  font-weight: 600;
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
