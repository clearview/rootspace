<template>
  <Modal
    title="User Space"
    :visible="visible"
    nosubmit
    nofooter
    cancel-text="Okay"
    @cancel="close"
  >
    <template v-slot:header>
      <div class="task-modal-header">
        <div class="task-modal-title">
          <div class="task-modal-title-editable" ref="titleEditable" contenteditable @keypress.enter.prevent="saveTitle" @blur="saveTitle">
            {{itemCopy.title}}
          </div>
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
          <input type="file" ref="attachmentFile" class="attachment-file" @input="handleAttachFile">
          <div class="actions">
            <button class="btn btn-mute" @click="pickFile" :disabled="isUploading">
              <v-icon name="attachment" viewbox="20" size="1rem"/>
              <span v-if="!isUploading">Attach</span>
              <span v-else>Uploading…</span>
            </button>
            <TagsPopover @input="handleTagMenu" :selected-tags="item.tags">
              <template v-slot:trigger>
                <button class="btn btn-mute">
                  <v-icon name="tag" size="1rem" viewbox="20"/>
                  <span>Tag</span>
                </button>
              </template>
            </TagsPopover>
            <DueDatePopover :initial-date="itemCopy.dueDate ? new Date(itemCopy.dueDate) : new Date()" @input="handleDateMenu" @clear="handleDateClear">
              <template v-slot:trigger>
                <button class="btn btn-mute">
                  <v-icon name="time" size="1rem" viewbox="20"/>
                  <span>Due Date</span>
                </button>
              </template>
            </DueDatePopover>
            <MemberPopover @input="handleMemberMenu">
              <template v-slot:trigger>
                <button class="btn btn-mute">
                  <v-icon name="plus2" size="1rem" viewbox="16"/>
                  <span>Member</span>
                </button>
              </template>
            </MemberPopover>
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
          <TaskComment v-for="comment in orderedComments" :comment="comment" :key="comment.id"/>
        </ul>

      </div>
      <div class="task-right">
        <div class="right-field">
          <div class="right-field-title">Tags</div>
          <div class="right-field-content">
            <ul class="tags" v-if="item.tags && item.tags.length > 0">
              <li class="tag" v-for="tag in item.tags" :key="tag.id" :style="{background: tag.color, color: textColor(tag.color)}"
                  @click="handleTagMenu(tag)">
                <span>{{tag.label}}</span>
                <v-icon name="close"/>
              </li>
            </ul>
            <template v-else>
              None
            </template>
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Members</div>
          <div class="right-field-content">
            <ul class="assignees" v-if="item.assignees && item.assignees.length > 0">
              <li class="assignee" v-for="assignee in item.assignees" :key="assignee.id"
                  @click="handleMemberMenu(assignee)">
                  <tippy :content="memberName(assignee)" arrow>
                    <template v-slot:trigger>
                      <avatar :username="memberName(assignee)"></avatar>
                      <v-icon name="close"/>
                    </template>
                  </tippy>
              </li>
            </ul>
            <template v-else>
              None
            </template>
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Attachments</div>
          <div class="right-field-content">
            <ul class="attachments" v-if="item.attachments && item.attachments.length > 0">
              <li v-for="attachment in item.attachments" :key="attachment.id" class="attachments-item">
                <TaskAttachmentView :attachment="attachment" @remove="handleRemoveFile"/>
              </li>
            </ul>
            <template v-else>
              None
            </template>
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Due Date</div>
          <div class="right-field-content" >
            <div class="due-date-box" v-if="item.dueDate">
              {{item.dueDate | formatDate}}
            </div>
            <template v-else>
              None
            </template>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator'
import Modal from '@/components/Modal.vue'
import { TagResource, TaskCommentResource, TaskItemResource, UploadResource, UserResource } from '@/types/resource'
import Field from '@/components/Field.vue'
import PopoverList from '@/components/PopoverList.vue'
import { Optional } from '@/types/core'
import TaskComment from '@/views/Task/TaskComment.vue'
import TagsPopover from '@/views/Task/TagsPopover.vue'
import MemberPopover from '@/views/Task/MemberPopover.vue'
import DueDatePopover from '@/views/Task/DueDatePopover.vue'
import Avatar from 'vue-avatar'
import TaskAttachmentView from '@/views/Task/TaskAttachmentView.vue'
import formatRelative from 'date-fns/formatRelative'

@Component({
  name: 'TaskModal',
  components: {
    TaskAttachmentView,
    DueDatePopover,
    TagsPopover,
    MemberPopover,
    TaskComment,
    PopoverList,
    Modal,
    Field,
    Avatar
  },
  filters: {
    formatDate (date: Date | string) {
      const dueDate = date instanceof Date ? date : new Date(date)
      return formatRelative(dueDate, new Date())
    }
  }
})
export default class TaskModal extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly visible!: boolean;

    @Prop({ type: Object, required: true })
    private readonly item!: TaskItemResource;

    @Ref('attachmentFile')
    private readonly attachmentFileRef!: HTMLInputElement

    @Ref('titleEditable')
    private readonly titleEditableRef!: HTMLDivElement

    private itemCopy = { ...this.item }
    private isEditingDescription = false;
    private commentInput = '';
    private isUploading = false
    private isUpdatingTitle = false
    private isEditingTitle = false

    get orderedComments () {
      return [...this.item.taskComments].sort((a, b) => {
        const x = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const y = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return y - x
      })
    }

    @Emit('cancel')
    cancel () {

    }

    @Emit('close')
    close () {

    }

    pickFile () {
      this.attachmentFileRef.click()
    }

    async handleAttachFile () {
      const file = this.attachmentFileRef.files?.item(0)
      if (file) {
        this.isUploading = true
        await this.$store.dispatch('task/item/upload', {
          task: this.itemCopy,
          file
        })
        this.isUploading = false
      }
    }

    async handleRemoveFile (attachment: UploadResource) {
      if (this.itemCopy.attachments) {
        this.itemCopy.attachments = this.itemCopy.attachments?.filter(attc => attc.id !== attachment.id)
        await this.$store.dispatch('task/item/update', {
          id: this.item.id,
          attachments: this.itemCopy.attachments
        })
      }
    }

    async saveDescription () {
      await this.$store.dispatch('task/item/update', {
        id: this.item.id,
        description: this.itemCopy.description
      })
      this.isEditingDescription = false
    }

    async saveComment () {
      const commentResource: Optional<TaskCommentResource, 'userId' | 'user' | 'createdAt' | 'updatedAt'> = {
        id: null,
        content: this.commentInput,
        taskId: this.item.id,
        task: this.item
      }
      await this.$store.dispatch('task/comment/create', commentResource)
      this.commentInput = ''
    }

    async handleMenu (value: string) {
      switch (value) {
        case 'delete':
          await this.$store.dispatch('task/item/destroy', this.item)
          break
      }
      this.close()
    }

    async handleTagMenu (tag: TagResource) {
      const exist = this.item.tags?.find(itemTag => itemTag.id === tag.id)
      if (exist) {
        await this.$store.dispatch('task/tag/removeFromTask', {
          taskId: this.item.id,
          tagId: tag.id
        })
      } else {
        await this.$store.dispatch('task/tag/addToTask', {
          taskId: this.item.id,
          tagId: tag.id
        })
      }
    }

    async handleMemberMenu (member: UserResource) {
      const exist = this.item.assignees?.find(itemAssignee => itemAssignee.id === member.id)
      if (exist) {
        await this.$store.dispatch('task/item/removeAssigneeFromTask', {
          taskId: this.item.id,
          userId: member.id
        })
      } else {
        await this.$store.dispatch('task/item/addAssigneeToTask', {
          taskId: this.item.id,
          userId: member.id
        })
      }
      const currentBoard = this.$store.state.task.board.current
      this.$emit('getUpdate', currentBoard)
    }

    async handleDateMenu (date: Date) {
      this.itemCopy.dueDate = date
      await this.$store.dispatch('task/item/update', {
        id: this.item.id,
        dueDate: this.itemCopy.dueDate
      })
    }

    async handleDateClear () {
      this.itemCopy.dueDate = null
      await this.$store.dispatch('task/item/update', {
        id: this.item.id,
        dueDate: null
      })
    }

    memberName (member: UserResource) {
      return `${member.firstName} ${member.lastName}`
    }

    async saveTitle () {
      this.titleEditableRef.blur()
      if (!this.isUpdatingTitle) {
        this.isUpdatingTitle = true
        this.itemCopy.title = this.titleEditableRef.innerText
        await this.$store.dispatch('task/item/update', {
          id: this.item.id,
          title: this.itemCopy.title
        })
        this.isUpdatingTitle = false
        this.isEditingTitle = false
      }
    }

    get colors () {
      return ['#DEFFD9', '#FFE8E8', '#FFEAD2', '#DBF8FF', '#F6DDFF', '#FFF2CC', '#FFDDF1', '#DFE7FF', '#D5D1FF', '#D2E4FF']
    }

    textColor (bgColor: string) {
      const textColor = ['#64a55a', '#ab5d5d', '#9a7a56', '#588f9c', '#733988', '#8c7940', '#883b68', '#394c84', '#47408c', '#5c89cc']
      const getBgPosition = this.colors.indexOf(bgColor)

      return textColor[getBgPosition]
    }
}
</script>

<style lang="postcss" scoped>

  .task-modal-header {
    @apply flex items-start py-8 px-12 pb-2;
    width: 820px;
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
    font-weight: normal;
    text-decoration: underline;
    cursor: default;
  }

  .task-modal-body {
    @apply flex items-start p-12 pb-8 pt-4;
    width: 820px;
    max-height: 80vh;
    overflow-y: scroll;
  }

  .task-left {
    flex: 1 0 0;
  }

  .task-right {
    @apply ml-8;
    flex: 0 1 auto;
    width: 210px;
  }

  .action-label {
    @apply pb-2;
    color: theme("colors.gray.800");
    text-transform: uppercase;
  }

  .actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0.5rem;
  }

  .actions .popover-container {
    flex: 0 1 auto;

    .btn {
      @apply px-3 w-full;

      & .stroke-current {
        fill: none;
      }

      & span {
        @apply pl-2;
      }
    }
  }

  .actions > .btn {
    @apply items-center px-3 ml-0;
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

  .tags,
  .assignees {
    @apply flex flex-wrap justify-start;
    max-width: 200px;
  }

  .tag,
  .assignee {
    @apply p-2 mr-2 rounded inline-flex items-center mb-2;
    color: #fff;
    cursor: pointer;

    svg {
      visibility: hidden;
    }

    &:hover {
      svg {
        visibility: visible;
      }
    }
  }

  .assignee {
    margin: 0;
    position: relative;

    .vue-avatar--wrapper {
      width: 30px !important;
      height: 30px !important;
      font: 10px / 20px Helvetica, Arial, sans-serif !important;
    }

    svg {
      position: absolute;
      background: theme("colors.gray.100");
      color: theme("colors.gray.900");
      top: 5px;
      right: 5px;
      border-radius: 10px;
    }
  }

  .attachment-file {
    @apply hidden;
  }

  .attachments {
    @apply flex items-center flex-wrap;
  }

  .task-modal-title-editable {
    @apply py-2 px-4 rounded;
    width: 80%;
    margin-left: -1rem;
    border: 2px solid transparent;

    &:focus {
      outline: none;
      border: 2px solid rgba(47, 128, 237, 0.75);
      box-shadow: 0 0 0 2px rgba(47, 128, 237, 0.25);
    }
  }
  .due-date-box {
    @apply rounded p-2;
    background: rgba(theme("colors.gray.100"), 0.3);
    color: theme("colors.gray.900");
    font-weight: 600;
  }

</style>
