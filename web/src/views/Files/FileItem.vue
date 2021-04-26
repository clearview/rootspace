<template>
  <div class="file-item">
    File Item
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator'
import { FilesResource, UserResource } from '@/types/resource'
import { Optional } from '@/types/core'

export default class FileItem extends Vue {
  @Prop({ type: Object, required: true })
  private readonly item!: Optional<FilesResource, 'updatedAt' | 'createdAt' | 'userId'>
}
</script>

<style>

</style>
