<template>
  <Modal
    title="User Space"
    :visible="visible"
    nosubmit
    nofooter
    cancel-text="Okay"
    @cancel="close"
    :modalStyle="{ 'align-items': 'flex-start' }"
    :contentStyle="{ 'margin-top': '50px' }"
  >
    <template v-slot:header>
      <div class="task-modal-header">
        <div class="task-modal-title">
          <div class="task-modal-title-editable" ref="titleEditable" contenteditable @keypress.enter.prevent="saveTitle" @blur="saveTitle(true)" @paste="handlePaste" v-text="itemCopy.title"></div>
          <div class="task-modal-subtitle">
            In list <span class="list-title">{{item.list.title}}</span>
          </div>
        </div>
        <div class="task-modal-header-actions">
          <PopoverList :items="[{label: 'Delete', value: 'delete'}]" @input="handleMenu">
            <template slot="trigger">
              <button
                class="btn btn-icon rounded"
                @click="cancel"
              >
                <v-icon name="ellipsis" viewbox="20" size="1.5rem" class="header-icon"/>
              </button>
            </template>
          </PopoverList>
          <button
            class="btn btn-icon rounded"
            @click="close"
          >
            <v-icon viewbox="20" size="1.5rem" name="close2" title="Close"/>
          </button>
        </div>
      </div>
    </template>
    <div class="task-modal-body" @dragenter="captureDragFile">
      <div class="task-drag-capture" v-if="isCapturingFile" @dragover="prepareDragFile" @dragleave="releaseDragFile" @drop="processDragFile">
          Drop a file to upload as attachment
      </div>
      <div class="task-left">
        <div class="task-actions">
          <div class="action-label">
            Add To Card
          </div>
          <input type="file" ref="attachmentFile" class="attachment-file" @input="handleAttachFile" multiple>
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
          </div>
        </div>
        <div class="task-description">
          <div class="description-title" v-if="!isEditingDescription" @click="isEditingDescription = true">
            <span class="description-title-placeholder">Description</span>
            <v-icon name="edit"/>
          </div>
          <div class="description-content" v-if="!isEditingDescription" v-html="itemCopy.description"></div>
          <div class="description-input" v-if="isEditingDescription">
            <quill-editor
              ref="myQuillEditor"
              :options="editorOption"
              v-model="descriptionCopy.description"
            />
            <div class="description-input-actions">
              <button class="btn btn-link" @click="cancelDescription">
                <v-icon name="close2" viewbox="20" title="Close"/>
              </button>
              <button class="btn btn-primary" @click="saveDescription">Save</button>
            </div>
          </div>
        </div>
        <div class="comment-separator"></div>
        <div class="comment-input">
          <textarea-autoresize
            placeholder="Write a comment…"
            class="comment-textarea"
            v-model="commentInput"
            @submit-comment="commentHandler"
          />
        </div>
        <ul class="comments">
          <TaskComment v-for="comment in orderedComments" :comment="comment" :key="comment.id"/>
        </ul>

      </div>
      <div class="task-right">
        <div class="right-field">
          <div class="right-field-title">Created By</div>
          <div class="right-field-content">
            <div class="created-by">
              <avatar :username="memberName(item.user)"></avatar>
              <span class="label">{{ memberName(item.user) }}</span>
            </div>
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Tags</div>
          <div class="right-field-content">
            <ul class="tags" v-if="item.tags && item.tags.length > 0">
              <li class="tag" v-for="tag in item.tags" :key="tag.id" :style="{background: tag.color, color: textColor(tag.color)}"
                  @click="handleTagMenu(tag)">
                <span>{{tag.label}}</span>
                <v-icon name="close" title="Close"/>
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
            <div class="member-list">
              <ul class="assignees">
                  <MemberPopover @input="handleMemberMenu" :selected-members="item.assignees">
                    <template v-slot:trigger>
                      <li class="addmember-button" content="Add Member" v-tippy>
                        <span>
                          <v-icon name="plus2" size="1rem" viewbox="16"/>
                        </span>
                      </li>
                    </template>
                  </MemberPopover>
                <li class="assignee" v-for="(assignee, index) in item.assignees" :key="assignee.id" :class="{ 'ml-3': (index === 0)}" :content="memberName(assignee)" v-tippy>
                  <avatar :username="memberName(assignee)"></avatar>
                </li>
              </ul>
            </div>
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
import { Component, Emit, Prop, Ref, Watch, Vue } from 'vue-property-decorator'
import Modal from '@/components/Modal.vue'
import { TagResource, TaskCommentResource, TaskItemResource, UploadResource, UserResource } from '@/types/resource'
import Field from '@/components/Field.vue'
import PopoverList from '@/components/PopoverList.vue'
import TextareaAutoresize from '@/components/TextareaAutoresize.vue'
import { Optional } from '@/types/core'
import TaskComment from '@/views/Task/TaskComment.vue'
import TagsPopover from '@/views/Task/TagsPopover.vue'
import MemberPopover from '@/views/Task/MemberPopover.vue'
import DueDatePopover from '@/views/Task/DueDatePopover.vue'
import Avatar from 'vue-avatar'
import TaskAttachmentView from '@/views/Task/TaskAttachmentView.vue'
import formatRelative from 'date-fns/formatRelative'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

@Component({
  name: 'TaskModal',
  components: {
    TaskAttachmentView,
    DueDatePopover,
    TagsPopover,
    MemberPopover,
    TaskComment,
    PopoverList,
    TextareaAutoresize,
    Modal,
    Field,
    Avatar,
    quillEditor
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
    private descriptionCopy = { ...this.itemCopy }
    private isEditingDescription = false;
    private commentInput = '';
    private isUploading = false
    private isUpdatingTitle = false
    private isEditingTitle = false
    private isCommenting = false
    private isCapturingFile = false
    private toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['link'],

      ['blockquote', 'code-block'],

      [{ list: 'ordered' }, { list: 'bullet' }]
    ]

    private editorOption = {
      modules: {
        toolbar: this.toolbarOptions
      },
      theme: 'snow',
      placeholder: 'Write a description...'
    }

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
      this.cancelDescription()
    }

    pickFile () {
      this.attachmentFileRef.click()
    }

    async handleAttachFile () {
      const files = this.attachmentFileRef.files
      if (files) {
        this.isUploading = true
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i)
          if (file) {
            await this.$store.dispatch('task/item/upload', {
              task: this.itemCopy,
              file
            })
          }
        }
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
        description: this.descriptionCopy.description
      })
      this.itemCopy.description = this.descriptionCopy.description
      this.isEditingDescription = false
    }

    cancelDescription () {
      this.isEditingDescription = false
      this.descriptionCopy.description = this.itemCopy.description
    }

    commentHandler (e: any) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        this.saveComment()
      }
    }

    async saveComment () {
      if (this.commentInput.trim().length <= 0 || this.isCommenting) {
        return
      }
      try {
        this.isCommenting = true
        const commentResource: Optional<TaskCommentResource, 'userId' | 'user' | 'createdAt' | 'updatedAt'> = {
          id: null,
          content: this.commentInput,
          taskId: this.item.id,
          task: this.item
        }
        await this.$store.dispatch('task/comment/create', commentResource)
        this.commentInput = ''
      } catch (e) {

      } finally {
        this.isCommenting = false
      }
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
          userId: member.id,
          user: member
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
      if (!member) return
      return `${member.firstName} ${member.lastName}`
    }

    async saveTitle (cancel = false) {
      if (this.titleEditableRef.innerText.trim().length > 0) {
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
      } else if (cancel) {
        this.titleEditableRef.innerText = this.itemCopy.title
        this.titleEditableRef.blur()
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

    captureDragFile () {
      if (!this.isUploading) {
        this.isCapturingFile = true
      }
    }

    releaseDragFile () {
      this.isCapturingFile = false
    }

    prepareDragFile (e: DragEvent) {
      e.preventDefault()
    }

    async processDragFile (e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      this.isCapturingFile = false
      const files = e.dataTransfer?.files
      if (files && files.length > 0) {
        this.isUploading = true
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i)
          if (file) {
            await this.$store.dispatch('task/item/upload', {
              task: this.itemCopy,
              file
            })
          }
        }
        this.isUploading = false
      }
    }

    handlePaste (e: ClipboardEvent) {
      e.preventDefault()
      const data = e.clipboardData?.getData('text/plain')
      if (data && this.titleEditableRef) {
        document.execCommand('insertText', false, data)
      }
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
    @apply flex items-start p-12 pb-8 pt-4 relative;
    width: 820px;
  }

  .task-left {
    flex: 1 0 0;
    width: 480px;
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
    @apply flex items-center justify-start;

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
    white-space: pre-line;
    word-break: break-word;
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

  .comment-textarea {
    @apply mb-4;
  }

  .right-field {
    @apply mb-4;
  }

  .right-field-title {
    @apply uppercase;
    color: theme("colors.gray.800");
    font-weight: 500;
    letter-spacing: 0.05em;
    font-size: 12px;
    margin-bottom: 8px;
  }

  .right-field-content {
    color: rgba(theme("colors.gray.800"), 0.5);
  }

  .tags,
  .assignees {
    @apply flex flex-wrap justify-start;
    max-width: 200px;
  }

  .tag {
    @apply px-2 py-1 mr-2 rounded inline-flex items-center mb-2;
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

  .addmember-button {
    display: inline-block;
    width: 32px;
    height: 32px;
    background: rgba(theme("colors.gray.100"), 0.5);
    color: theme("colors.gray.900");
    border-radius: 32px;
    padding: 7px 7px 7px 8px;
    cursor: pointer;
    margin-top: 3px;

    &:hover{
       background: rgba(216, 55, 80, 0.16);
       color: theme("colors.primary.default");

     }

    div, span, svg {
      &:focus {
        outline: none;
      }
    }
  }

  .member-list {
    @apply pb-2;

    display: inline-block;
    width: 170px;
  }

  .assignees {
    @apply flex flex-wrap justify-start;

    li {
      &.addmember-button {
        margin: 0;
      }

      .vue-avatar--wrapper {
        width: 35px !important;
        height: 35px !important;
        font: 13px / 24px theme("fontFamily.primary") !important;
        float: left;
        border: 2px solid #FFF;
        margin-left: -7px;
        letter-spacing: 0.03em;
      }
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

  .input-description {
    height: 5rem;
    transition: none;
  }

  .task-drag-capture {
    @apply z-50 absolute flex items-center justify-center text-3xl;
    color: theme("colors.gray.900");
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    background: #fff8;
    backdrop-filter: saturate(1.5) blur(4px);
  }

  .created-by {
    @apply flex;

    padding-left: 6px;

    .vue-avatar--wrapper {
      width: 35px !important;
      height: 35px !important;
      font: 13px / 24px theme("fontFamily.primary") !important;
      float: left;
      border: 2px solid #FFF;
      margin-left: -7px;
      letter-spacing: 0.03em;
    }

    .label {
      @apply self-center ml-2;

      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
    }
  }

</style>

<style>
.ql-editor, .description-content {
  line-height: 1.5rem;
  font-size: 15px;
}

.ql-editor {
  font-size: 15px;
  min-height: 180px;
  max-height: 650px;
}

.description-content {
  a {
    border-bottom: 1px dashed;
  }

  ol, ul {
    padding-left: 1.5em;

    li {
      padding-left: 1.5em;

      &::before {
          margin-left: -1.5em;
          margin-right: 0.3em;
          text-align: right;
      }
    }
  }

  ol {
    li {
      counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
      counter-increment: list-0;

      &::before {
        content: counter(list-0, decimal) '. ';
      }
    }
  }

  ul {
    li {
      &::before {
        content: '\2022';
      }
    }
  }
}
</style>

<style lang="postcss">
.assignees {
  .popover-container {
    margin-top: 2px;

    .popover-trigger {
      height: 32px;
    }
  }
}
</style>
