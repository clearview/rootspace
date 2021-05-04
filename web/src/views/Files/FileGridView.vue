<template>
  <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" v-if="file">
    <div class="file-item" v-for="(file, index) in file.uploads" :key="index" @click="downloadFile(file.location)">
      <div class="icon-thumbnail">
        <legacy-icon class="stroke-0" size="4.1em" viewbox="65" :name="fileIcon(file.mimetype)" />
        <div class="download-wrapper">
          <span class="download-file">
            <legacy-icon
              name="download"
              size="28px"
              viewbox="16"
            />
          </span>
        </div>
        <div class="action-wrapper">
          <Popover :z-index="1001" top="38px" :with-close="false" position="bottom-start">
            <template #default>
              <div class="action-line">
                <legacy-icon class="action-icon" name="download" viewbox="16" size="16px"></legacy-icon>
                <div class="action-line-text" @click="downloadFile(file.location)">
                  Download
                </div>
              </div>
            </template>
            <template #trigger="{ visible }">
              <button class="btn btn-link" :class="{'btn-link-primary': visible}">
                <legacy-icon name="ellipsis" viewbox="20" size="1.25rem"/>
              </button>
            </template>
          </Popover>
        </div>
      </div>
      <div class="content">
        <h3>{{ file.filename }}</h3>
        Added by {{ file.userId }} • {{ formatDate(file.createdAt) }} • {{ file.size | formatFileSize }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { FilesResource } from '@/types/resource'
import moment from 'moment'

@Component({
  name: 'FileGridView',
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
  @Prop({ type: Object, required: true })
  private readonly file!:FilesResource

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
}
</script>

<style lang="postcss" scoped>
.file-item {
  @apply flex flex-col;
  border: 1px solid #DEE2EE;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #F8F8FB;
    .download-wrapper, .action-wrapper {
      display: flex;
    }
  }
}
.download-wrapper {
  @apply flex-wrap justify-center content-center w-full h-full absolute;
  display: none;
  background: #F8F8FB;
  .download-file { /* TODO : Change download icon color */
    background: #DDF3FF;
    padding: 16px 40px;
    border-radius: 34px;
  }
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
}
.content {
  @apply p-5;
}
h3 {
  font-size: 1rem;
  font-weight: bold;
}
</style>
