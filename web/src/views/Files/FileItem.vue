<template>
  <div class="file-item-wrapper p-5" v-if="item">
    <file-grid-view
      :file="item"
    />
    <file-list-view
      :file="item"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { FilesResource } from '@/types/resource'
import Popover from '@/components/Popover.vue'
import FileListView from '@/views/Files/FileListView.vue'
import FileGridView from '@/views/Files/FileGridView.vue'

@Component({
  name: 'FileItem',
  components: {
    Popover,
    FileListView,
    FileGridView
  }
})

export default class FileItem extends Vue {
  @Prop({ type: Object, required: true })
  private readonly item!:FilesResource
}
</script>

<style lang="postcss" scoped>
</style>
