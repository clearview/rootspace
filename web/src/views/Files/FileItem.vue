<template>
  <div class="file-item-wrapper p-5" v-if="item">
    <div class="grid grid-cols-3 gap-4">
      <div class="file-item" v-for="(file, index) in item.uploads" :key="index">
        <div class="icon-thumbnail">
          {{ file.mimetype }}
        </div>
        <div class="content">
          <h3>{{ file.name }}</h3>
          Added by User - {{ formatDate(file.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { FilesResource, UserResource } from '@/types/resource'
import { Optional } from '@/types/core'
import moment from 'moment'

@Component({
  name: 'FileItem'
})

export default class FileItem extends Vue {
  @Prop({ type: Object, required: true })
  private readonly item!: Optional<FilesResource>

  formatDate (fileDate: Date | string) {
    return moment(fileDate).format('DD.MM.YYYY')
  }
}
</script>

<style lang="postcss" scoped>
.file-item {
  @apply flex flex-col;
  border: 1px solid #DEE2EE;
  border-radius: 4px;
}
h3 {
  font-size: 1rem;
  font-weight: bold;
}
</style>
