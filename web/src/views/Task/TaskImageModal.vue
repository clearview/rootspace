<template>
  <Modal
    title="Image"
    :visible="visible"
    noheader
    nosubmit
    nofooter
    cancel-text="Okay"
    @cancel="close"
    portal="secondary"
  >
    <div class="task-modal-body">
      <div class="close">
        <button class="btn btn-icon" @click="open">
          <v-icon name="file" viewbox="32"/>
        </button>
        <button class="btn btn-icon" @click="close">
          <v-icon name="close" title="Close"/>
        </button>
      </div>
      <img :src="src" alt="" class="image">
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import Modal from '@/components/legacy/Modal.vue'

  @Component({
    name: 'TaskImageModal',
    components: {
      Modal
    }

  })
export default class TaskImageModal extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly visible!: boolean;

    @Prop({ type: String, required: true })
    private readonly src!: string;

    @Emit('close')
    close () {

    }

    open () {
      window.open(this.src, '_blank')
    }
}
</script>

<style lang="postcss" scoped>

  .task-modal-body {
    @apply relative;
  }

  .image {
    @apply rounded shadow shadow-lg;
    max-width: 80vw;
    max-height: 80vh;
  }

  .close {
    @apply absolute flex;
    top: 12px;
    right: 12px;
  }

</style>
