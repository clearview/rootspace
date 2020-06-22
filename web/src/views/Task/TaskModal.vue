<template>
  <Modal
    title="User Workspace"
    :visible="visible"
    nosubmit
    nofooter
    cancel-text="Okay"
  >
    <template v-slot:header>
      <div class="task-modal-header">
        <div class="task-modal-title">
          {{ item.title }}
          <div class="task-modal-subtitle">
            In list <span class="list-title">{{item.list.title}}</span>
          </div>
        </div>
        <button
          class="btn btn-icon rounded-full"
          @click="cancel"
        >
          <v-icon name="close" />
        </button>
      </div>
    </template>
    <div class="task-modal-body">
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Modal from '@/components/Modal.vue'
import { TaskItemResource } from '@/types/resource'

@Component({
  name: 'TaskModal',
  components: {
    Modal
  }
})
export default class TaskModal extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly visible!: boolean;

  @Prop({ type: Object, required: true })
  private readonly item!: TaskItemResource;

  @Emit('cancel')
  cancel () {

  }
}
</script>

<style lang="postcss" scoped>

  .task-modal-header {
    @apply flex items-center py-8 px-12;
    font-weight: bold;
  }
  .task-modal-title{
    @apply text-2xl;
    color: theme('colors.gray.900');
    flex: 1 1 auto;
  }
  .task-modal-subtitle{
    @apply text-base;
    color: theme('colors.gray.800');
    font-weight: normal;
  }
  .list-title {
    font-weight: bold;
    text-decoration: underline;
    cursor: default;
  }

  .task-modal-body {
    @apply p-12 pb-8 pt-4;
    min-width: 720px;
  }

</style>
