<template>
  <div class="file-item-wrapper p-5" v-if="item">
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <div class="file-item" v-for="(file, index) in item.uploads" :key="index">
        <div class="icon-thumbnail">
          <legacy-icon class="stroke-0" size="65" viewbox="65" :name="fileIcon(file.mimetype)" />
        </div>
        <div class="content">
          <h3>{{ file.filename }}</h3>
          Added by User • {{ formatDate(file.createdAt) }} • {{ file.size | formatFileSize }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { FilesResource } from '@/types/resource'
import { Optional } from '@/types/core'
import moment from 'moment'

@Component({
  name: 'FileItem',
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

export default class FileItem extends Vue {
  @Prop({ type: Object, required: true })
  private readonly item!: Optional<FilesResource>

  formatDate (fileDate: Date | string) {
    return moment(fileDate).format('MMM DD, YYYY')
  }

  fileIcon (type: string) {
    switch (type) {
      case 'application/pdf':
        return 'filePdf'
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
}
.icon-thumbnail {
  @apply flex flex-wrap justify-center content-center;
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
