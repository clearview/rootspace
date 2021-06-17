<template>
  <div class="my-10" v-if="item">
    <div :class="classNames">
      <div v-for="(item, index) in tempItems" :key="-(index + 1)" class="item item__placeholder">
        <div class="progress">
          <radial-progress-bar
            :diameter="isList ? 55 : 110"
            :completedSteps="item.progress"
            innerStrokeColor="#dee2ee"
            startColor="#8cd5ff"
            stopColor="#8cd5ff"
            :strokeWidth="5"
            :innerStrokeWidth="5"
            :totalSteps="100"
          >
            <span>{{ item.progress }} %</span>
          </radial-progress-bar>
        </div>
        <div class="content">
          <strong>{{ item.name }}</strong>
        </div>
      </div>
      <div v-for="(file, index) in item" :key="index" class="item">
        <component
          :is="itemComponent"
          :file="file"
          :index="index"
          @delete="handleDelete"
          @download="handleDownload"
          @restore="handleRestore"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import RadialProgressBar from 'vue-radial-progress'
import ListItem from '@/views/Storage/StorageListItem.vue'
import GridItem from '@/views/Storage/StorageGridItem.vue'

import { NewUploadResource, StorageViewType } from '@/types/resource'

@Component({
  name: 'StorageCollection',
  components: {
    ListItem,
    GridItem,
    RadialProgressBar
  }
})
export default class StorageItem extends Vue {
  @Prop({ type: Array, required: true })
  private readonly item!: NewUploadResource;

  @Prop({ type: Boolean, required: true })
  private readonly isUploading!: boolean;

  @Prop({ type: Array, required: true })
  private readonly tempItems!: Record<string, any>[];

  get isList (): boolean {
    return this.viewType === StorageViewType.List
  }

  get viewType (): StorageViewType {
    return this.$store.state.storage.viewAs
  }

  get classNames () {
    return {
      collection: true,
      collection__list: this.viewType === StorageViewType.List,
      collection__grid: this.viewType === StorageViewType.Grid
    }
  }

  get itemComponent () {
    return this.isList
      ? 'list-item'
      : 'grid-item'
  }

  handleDelete (id: number) {
    this.$emit('file:delete', id)
  }

  handleDownload (file: NewUploadResource) {
    this.$emit('file:download', file)
  }

  handleRestore (file: NewUploadResource) {
    this.$emit('file:restore', file)
  }
}
</script>

<style lang="postcss" scoped>
.collection {
  display: grid;
}

.collection__list {
  grid-template-columns: repeat(1, minmax(300px, 1fr));
  gap: 0;

  .item.item__placeholder {
    display: flex;
    flex-flow: row;
    padding: 1.25rem;

    .progress {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .content {
      padding: 1.25em;
    }
  }
}

.collection__grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 19px;

  .item.item__placeholder {
    border: 1px solid #dee2ee;
    border-radius: 4px;

    .progress {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
    }

    .content {
      padding: 1.25em;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.temp-file-item {
  @apply flex;
  border-radius: 4px;
  &.grid-view {
    @apply flex-col;
    border: 1px solid #dee2ee;
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
    border-bottom: 1px solid #f8f8fb;
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
