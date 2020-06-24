<template>
  <Modal
    title="User Workspace"
    :visible="visible"
    nosubmit
    nofooter
    cancel-text="Okay"
    @cancel="close"
  >
    <template v-slot:header>
      <div class="task-modal-header">
        <div class="task-modal-title">
          {{ item.title }}
          <div class="task-modal-subtitle">
            In list <span class="list-title">{{item.list.title}}</span>
          </div>
        </div>
        <div class="task-modal-header-actions">
          <PopoverList :items="[{label: 'Delete', value: 'delete'}]" @input="handleMenu">
            <template slot="trigger">
              <button
                class="btn btn-icon rounded-full"
                @click="cancel"
              >
                <v-icon name="ellipsis" viewbox="20" size="1.5rem" class="header-icon"/>
              </button>
            </template>
          </PopoverList>
          <button
            class="btn btn-icon rounded-full"
            @click="close"
          >
            <v-icon viewbox="20" size="1.5rem" name="close2"/>
          </button>
        </div>
      </div>
    </template>
    <div class="task-modal-body">
      <div class="task-left">
        <div class="task-actions">
          <div class="action-label">
            Add To Card
          </div>
          <div class="actions">
            <button class="btn btn-mute">
              <v-icon name="attachment" viewbox="20" size="1rem"/>
              <span>Attach</span>
            </button>
            <button class="btn btn-mute">
              <v-icon name="tag" size="1rem" viewbox="20"/>
              <span>Tag</span>
            </button>
            <button class="btn btn-mute">
              <v-icon name="time" size="1rem" viewbox="20"/>
              <span>Due Date</span>
            </button>
            <button class="btn btn-mute">
              <v-icon name="plus2" size="1rem" viewbox="16"/>
              <span>Member</span>
            </button>
          </div>
        </div>
        <div class="task-description">
          <div class="description-title" v-if="!isEditingDescription" @click="isEditingDescription = true">
            <span class="description-title-placeholder">Description</span>
            <v-icon name="edit"/>
          </div>
          <div class="description-content" v-if="!isEditingDescription">
            {{itemCopy.description}}
          </div>
          <div class="description-input" v-if="isEditingDescription">
            <textarea
              class="input"
              placeholder="Write a description…"
              v-model="itemCopy.description"
            />
            <div class="description-input-actions">
              <button class="btn btn-link" @click="isEditingDescription = false">
                <v-icon name="close2" viewbox="20"/>
              </button>
              <button class="btn btn-primary" @click="saveDescription">Save</button>
            </div>
          </div>
        </div>
        <div class="comment-separator"></div>
        <div class="comment-input">
          <input
            type="text"
            class="input"
            placeholder="Write a comment…"
            v-model="commentInput"
            @keyup.enter="saveComment"
          >
        </div>
        <ul class="comments">
          <TaskComment v-for="comment in item.taskComments" :comment="comment" :key="comment.id"/>
        </ul>

      </div>
      <div class="task-right">
        <div class="right-field">
          <div class="right-field-title">Tags</div>
          <div class="right-field-content">
            None
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Members</div>
          <div class="right-field-content">
            None
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Attachments</div>
          <div class="right-field-content">
            None
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Due Date</div>
          <div class="right-field-content">
            None
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import Modal from '@/components/Modal.vue'
import { TaskCommentResource, TaskItemResource } from '@/types/resource'
import Field from '@/components/Field.vue'
import PopoverList from '@/components/PopoverList.vue'
import { Optional } from '@/types/core'
import TaskComment from '@/views/Task/TaskComment.vue'

  @Component({
    name: 'TaskModal',
    components: {
      TaskComment,
      PopoverList,
      Modal,
      Field
    }
  })
export default class TaskModal extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly visible!: boolean;

    @Prop({ type: Object, required: true })
    private readonly item!: TaskItemResource;

    private itemCopy = { ...this.item }
    private isEditingDescription = false;
    private commentInput = '';

    @Emit('cancel')
    cancel () {

    }

    @Emit('close')
    close () {

    }

    async saveDescription () {
      await this.$store.dispatch('task/item/update', this.itemCopy)
      await this.$store.dispatch('task/board/refresh')
      this.isEditingDescription = false
    }

    async saveComment () {
      const commentResource: Optional<TaskCommentResource, 'userId' | 'createdAt' | 'updatedAt'> = {
        id: null,
        content: this.commentInput,
        taskId: this.item.id,
        task: this.item
      }
      await this.$store.dispatch('task/comment/create', commentResource)
      this.commentInput = ''

      await this.$store.dispatch('task/board/refresh')
    }

    async handleMenu (value: string) {
      switch (value) {
        case 'delete':
          await this.$store.dispatch('task/item/destroy', this.item)
          break
      }
      this.close()
      await this.$store.dispatch('task/board/refresh')
    }
}
</script>

<style lang="postcss" scoped>

  .task-modal-header {
    @apply flex items-center py-8 px-12 pb-2;
    font-weight: bold;
  }

  .task-modal-header-actions {
    @apply flex items-center;
  }

  .task-modal-header-actions * ~ * {
    @apply ml-2;
  }

  .task-modal-title {
    @apply text-2xl;
    color: theme('colors.gray.900');
    flex: 1 1 auto;
  }

  .task-modal-subtitle {
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
    @apply flex items-start p-12 pb-8 pt-4;
    min-width: 720px;
  }

  .task-left {
    flex: 1 1 auto;
  }

  .task-right {
    @apply ml-8;
    flex: 0 0 auto;
    min-width: 200px;
  }

  .action-label {
    @apply pb-2;
    color: theme("colors.gray.800");
    text-transform: uppercase;
  }

  .actions {
    display: flex;
  }

  .actions .btn {
    @apply flex items-center px-3;
    flex: 0 1 auto;

    & .stroke-current {
      fill: none;
    }

    & span {
      @apply pl-2;
    }
  }

  .task-description {
    @apply mt-4;
  }

  .description-title {
    @apply flex items-center;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .description-title-placeholder {
    @apply uppercase pr-2;
    color: theme("colors.gray.800");
  }

  .description-input {
    @apply my-2;
  }
  .description-input-actions {
    @apply flex items-center justify-end mt-4;
    .btn {
      @apply px-4;
      flex: 0 0 auto;
    }
  }
  .description-content {
    @apply my-2;
    font-size: 14px;
    line-height: 1.2;
    white-space: pre-line;
  }

  .comment-separator {
    @apply my-8;
    height: 1px;
    background: theme("colors.gray.100");
  }

  .comments {
    @apply py-2;
    max-height: 40vh;
    overflow-y: auto;
    overflow-x: visible;
  }

  .comment-input {
    @apply mb-4;
  }

  .input {
    @apply w-full;
  }

  .right-field {
    @apply mb-4;
  }

  .right-field-title {
    @apply uppercase;
    color: theme("colors.gray.800");
    font-weight: 500;
  }

  .right-field-content {
    color: rgba(theme("colors.gray.800"), 0.5);
  }

</style>
