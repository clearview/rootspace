<template>
  <div class="file-item-wrapper p-5 pt-10" v-if="item">
    <div class="grid grid-cols-1" v-if="isList">
       <div v-for="(file, index) in item.uploads"
         :key="index">
        <file-list-view
          :file="file"
          :index="index"
        />
       </div>
    </div>
    <file-grid-view
      :file="item"
      v-else
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { FilesResource, FilesViewType } from '@/types/resource'
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

  get isList (): boolean {
    return this.prefferedView === FilesViewType.List
  }

  get prefferedView (): FilesViewType {
    return this.$store.state.files.viewAs
  }
}
</script>

<style lang="postcss" scoped>
</style>
