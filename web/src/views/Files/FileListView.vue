<template>
  <div class="grid grid-cols-1 gap-4" v-if="file">
    <div class="file-item" v-for="(file, index) in file.uploads" :key="index">
      <div class="file-item--icon">
        <legacy-icon class="stroke-0" size="4.1em" viewbox="65" :name="fileIcon(file.mimetype)" />
      </div>
      <div class="file-item--content">
        <h3>{{ file.filename }}</h3>
        Added by {{ file.userId }} • {{ formatDate(file.createdAt) }} • {{ file.size | formatFileSize }}
      </div>
      <div class="file-item--action">
        <div class="download-file" @click="downloadFile(file.location)">
          <legacy-icon class="action-icon" name="download" viewbox="19" size="19px"></legacy-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { FilesResource } from '@/types/resource'
import moment from 'moment'

@Component({
  name: 'FileListView',
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
h3 {
  @apply mb-2;
  font-size: 1rem;
  font-weight: bold;
}
.file-item {
  @apply flex flex-row p-5 items-center;
  border-bottom: 1px solid #DEE2EE;
  cursor: pointer;
  &:hover {
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
</style>
