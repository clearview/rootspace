<template>
  <div class="file-item-wrapper p-5 pt-10" v-if="item">
    <div class="grid grid-cols-1" v-if="isList">
       <div v-for="(file, index) in item" :key="index">
        <storageListView
          :file="file"
          :index="index"
          @deleted="refreshParent"
        />
       </div>
       <div class="temp-file-item list-view" v-if="isUploading">
        <div class="progress-wrapper">
          <radial-progress-bar
            :diameter="70"
            :completedSteps="tempFile.progress"
            innerStrokeColor="#dee2ee"
            startColor="#8cd5ff"
            stopColor="#8cd5ff"
            :strokeWidth="5"
            :innerStrokeWidth="5"
            :totalSteps="100" >
            <span>{{ tempFile.progress }} %</span>
          </radial-progress-bar>
        </div>
        <div class="content">
          {{ tempFile.name }}
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" v-else>
      <div v-for="(file, index) in item" :key="index">
        <storageGridView
          :file="file"
          :index="index"
          @deleted="refreshParent"
        />
      </div>
      <div class="temp-file-item grid-view" v-if="isUploading">
        <div class="progress-wrapper">
          <radial-progress-bar
            :diameter="111"
            :completedSteps="tempFile.progress"
            innerStrokeColor="#dee2ee"
            startColor="#8cd5ff"
            stopColor="#8cd5ff"
            :strokeWidth="5"
            :innerStrokeWidth="5"
            :totalSteps="100" >
            <span>{{ tempFile.progress }} %</span>
          </radial-progress-bar>
        </div>
        <div class="content">
          {{ tempFile.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { NewUploadResource, StorageViewType } from '@/types/resource'
import RadialProgressBar from 'vue-radial-progress'
import StorageListView from '@/views/Storage/StorageListView.vue'
import StorageGridView from '@/views/Storage/StorageGridView.vue'

@Component({
  name: 'StorageItem',
  components: {
    StorageListView,
    StorageGridView,
    RadialProgressBar
  }
})

export default class StorageItem extends Vue {
  @Prop({ type: Array, required: true })
  private readonly item!:NewUploadResource

  @Prop({ type: Boolean, required: true })
  private readonly isUploading

  @Prop({ type: Object, required: true })
  private readonly tempFile

  get isList (): boolean {
    return this.prefferedView === StorageViewType.List
  }

  get prefferedView (): StorageViewType {
    return this.$store.state.storage.viewAs
  }

  refreshParent () {
    this.$emit('deleted')
  }
}
</script>

<style lang="postcss" scoped>
.temp-file-item {
  @apply flex;
  border-radius: 4px;
  &.grid-view {
    @apply flex-col;
    border: 1px solid #DEE2EE;
    .progress-wrapper {
      @apply flex flex-wrap justify-center content-center w-full h-full;
    }
    .content {
      @apply p-5 truncate;
      font-size: 1rem;
      font-weight: bold;
    }
  }
  &.list-view {
    @apply flex-row;
    border-bottom: 1px solid #F8F8FB;
    .progress-wrapper {
      @apply flex flex-wrap justify-center content-center p-4;
    }
    .content {
      @apply flex w-full truncate;
      align-items: center;
      font-size: 1rem;
      font-weight: bold;
    }
  }
}
</style>
