<template>
  <div class="file-item-wrapper p-5 pt-10" v-if="item">
    <file-grid-view
      :file="item"
      v-if="false"
    />

    <div class="grid grid-cols-1">
       <div v-for="(file, index) in item.uploads"
         :key="index">
        <file-list-view
          :file="file"
          :index="index"
        />
       </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { FilesResource } from '@/types/resource'
import FileListView from '@/views/Files/FileListView.vue'
import FileGridView from '@/views/Files/FileGridView.vue'

@Component({
  name: 'FileItem',
  components: {
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
