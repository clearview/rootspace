<template>
  <div class="attachment" @click="viewAttachment">
      <div class="attachment-media" v-if="isAttachmentImage">
        <img :src="attachment.path" :alt="attachment.id">
      </div>
      <div v-else class=attachment-media>
        <img src="../../assets/images/space.png" :alt="attachment.id">
      </div>
      <div class="attachment-close">
      </div>
      <div class="attachment-name">
        {{attachment.path | formatAttachmentName}}
      </div>
    <TaskImageModal v-if="isShowImage" :src="attachment.path" :visible="isShowImage" @close="isShowImage = false"/>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { UploadResource } from '@/types/resource'
import TaskImageModal from '@/views/Task/TaskImageModal.vue'

  @Component({
    name: 'TaskAttachmentView',
    components: { TaskImageModal },
    filters: {
      formatAttachmentName (path: string) {
        const splits = path.split('/')
        return splits[splits.length - 1]
      }
    }
  })
export default class TaskAttachmentView extends Vue {
    @Prop({ type: Object, required: true })
    private readonly attachment!: UploadResource;

    private isShowImage = false

    @Emit('remove')
    remove (attachment: UploadResource) {
      return attachment
    }

    get isAttachmentImage () {
      return this.attachment.type === 'image/jpeg' || this.attachment.type === 'image/png'
    }

    viewAttachment () {
      if (this.isAttachmentImage) {
        this.isShowImage = true
      } else {
        window.open(this.attachment.path, '_blank')
      }
    }
}
</script>

<style lang="postcss" scoped>
  .attachment {
    @apply mr-2 mb-2 rounded overflow-hidden relative;
    flex: 0 1 auto;
  }

  .attachment-media {
    img {
      @apply rounded;
      width: 72px;
      height: 72px;
      object-fit: cover;
    }
  }

  .attachment-name {
    @apply absolute p-2;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to bottom, #0000, #000a);
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .attachment-close {
    @apply absolute p-2;
    visibility: hidden;
    top: 0;
    right: 0;
    text-align: right;
    background: transparent;
    color: #fff;
    opacity: 0;
    transition: all 0.3s ease;
  }

  .attachment:hover .attachment-close {
    visibility: visible;
    opacity: 1;
  }

  .attachment-close .btn:hover {
    background: rgba(170, 177, 197, 1);
  }

  .btn-icon {
    @apply p-1;
    font-size: 12px;
  }
</style>
