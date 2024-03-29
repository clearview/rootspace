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
          <div class="task-modal-title-editable" ref="titleEditable" :contenteditable="!archivedView" @keypress.enter.prevent="saveTitle" @blur="saveTitle(true)" @paste="handlePaste" v-text="title"></div>
          <div class="task-modal-subtitle">
            In list <span class="list-title">{{item.list.title}}</span>
          </div>
        </div>
        <div class="task-modal-header-actions">
          <button
            class="btn btn-icon"
            @click="close"
          >
            <legacy-icon viewbox="20" size="1rem" name="close2" title="Close"/>
          </button>
        </div>
      </div>
    </template>
    <div class="task-modal-body" @dragenter="captureDragFile">
      <div class="task-drag-capture" v-if="isCapturingFile && !archivedView" @dragover="prepareDragFile" @dragleave="releaseDragFile" @drop="processDragFile">
        <legacy-icon
          name="upload"
          size="32px"
          viewbox="32"
        />
        Drop a file to upload as attachment
      </div>
      <div class="task-left">
        <div class="task-actions" v-if="!archivedView">
          <div class="action-label">
            Add To Card
          </div>
          <input type="file" ref="attachmentFile" class="attachment-file" @input="handleAttachFile" multiple>
          <div class="actions">
            <button class="btn btn-mute" @click="pickFile" :disabled="isUploading" :class="{ 'uploading': isUploading }">
              <legacy-icon v-if="!isUploading" name="attachment" viewbox="20" size="1rem"/>
              <legacy-icon v-else name="loading" size="1rem" viewbox="100" />

              <span v-if="!isUploading">Attach</span>
              <span v-else>Uploading…</span>
            </button>
            <TagsPopover @input="handleTagMenu" :selected-tags="item.tags" @create="handleCreateTag" @update="handleUpdateTag">
              <template v-slot:trigger>
                <button class="btn btn-mute">
                  <legacy-icon name="tag" size="1rem" viewbox="20"/>
                  <span>Tag</span>
                </button>
              </template>
            </TagsPopover>
            <DueDatePopover :initial-date="itemCopy.dueDate ? new Date(itemCopy.dueDate) : new Date()" @input="handleDateMenu" @clear="handleDateClear">
              <template v-slot:trigger>
                <button class="btn btn-mute">
                  <legacy-icon name="time" size="1rem" viewbox="20"/>
                  <span>Due Date</span>
                </button>
              </template>
            </DueDatePopover>
          </div>
        </div>
        <div class="task-description">
          <div class="description-title" v-if="!isEditingDescription" @click="isEditingDescription = true && !archivedView">
            <span class="description-title-placeholder">Description</span>
            <legacy-icon name="edit" size="1rem" viewbox="32" v-if="!archivedView"/>
          </div>
          <Editor
            :readonly="!isEditingDescription"
            v-model="description"
            @save="saveDescription"
            @cancel="cancelDescription"
          />
        </div>
        <div class="task-attachments" v-if="item.attachments && item.attachments.length > 0">
          <div class="attachments-label">
            Attachments
          </div>
          <imageViewer
            v-model="attachmentIndex"
            :images="item.attachments"
            :archivedView="archivedView"
            @remove="handleRemoveFile"
          ></imageViewer>
          <ul class="attachments" v-if="item.attachments">
            <li v-for="index in maxShownAttachment" :key="item.attachments[index-1] ? 'taskAttachmentView' + item.attachments[index-1].id : `'taskAttachmentView ${index}`" class="attachments-item">
              <TaskAttachmentView v-if="item.attachments[index-1]" :attachment="item.attachments[index-1]" :index="index-1" :archivedView="archivedView" @remove="handleRemoveFile" @attachmentClick="handleFileClick"/>
            </li>
          </ul>
          <div v-if="item.attachments.length > 5">
            <p class="show-attachments" @click="attachmentState()">
              <legacy-icon :name="iconAttachmentState" size="25px" viewbox="32"/>
              {{ textAttachmentState }}
            </p>
          </div>
        </div>
        <div class="comment-separator"></div>
        <div class="comment-input">
          <textarea-autoresize
            v-if="!archivedView"
            placeholder="Write a comment…"
            class="comment-textarea"
            v-model="commentInput"
            @submit-comment="commentHandler"
          />
        </div>
        <ul class="comments" v-if="orderedComments.length > 0">
          <TaskComment v-for="comment in orderedComments" :comment="comment" :key="comment.id"/>
        </ul>
        <div class="text-gray-400" v-else-if="archivedView">
          No comments
        </div>
        <div class="comment-separator"></div>
        <TaskActivities :item="item"></TaskActivities>
      </div>
      <div class="task-right">
        <div class="right-field">
          <div class="right-field-title">Created By</div>
          <div class="right-field-content">
            <div class="created-by cursor-pointer" @click="openProfile(item.user)">
              <avatar :size="24" :src="item.user && item.user.avatar && item.user.avatar.versions ? item.user.avatar.versions.default.location : ''" :username="memberName(item.user)"></avatar>
              <span class="label">{{ memberName(item.user) }}</span>
            </div>
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Tags</div>
          <div class="right-field-content">
            <ul class="tags" v-if="item.tags && item.tags.length > 0">
              <li class="tag" v-for="tag in item.tags" :key="tag.id" :style="{background: tag.color, color: textColor(tag.color)}">
                <span>{{tag.label}}</span>
              </li>
            </ul>
            <template v-else>
              <span>None</span>
            </template>
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Members</div>
          <div class="right-field-content">
            <div class="member-list">
              <ul class="assignees">
                <MemberPopover @input="handleMemberMenu" :selected-members="assignees" v-if="!archivedView">
                  <template v-slot:trigger>
                    <li class="addmember-button" content="Add Member" v-tippy>
                      <span>
                        <legacy-icon name="plus2" size="1rem" viewbox="16"/>
                      </span>
                    </li>
                  </template>
                </MemberPopover>
                <li class="assignee cursor-pointer" v-for="(assignee, index) in assignees" :key="assignee.id" :class="{ 'ml-3': (index === 0)}" :content="memberName(assignee)" @click="openProfile(assignee)" v-tippy>
                  <avatar :size="24" :src="assignee.avatar && assignee.avatar.versions ? assignee.avatar.versions.default.location : ''"  :username="memberName(assignee)"></avatar>
                </li>
              </ul>
            <template v-if="archivedView">
              <span>None</span>
            </template>
            </div>
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Due Date</div>
          <div class="right-field-content" >
            <div class="due-date-box" v-if="item.dueDate">
              {{item.dueDate | formatDate}}
            </div>
            <template v-else>
              <span>None</span>
            </template>
          </div>
        </div>
        <div class="right-field">
          <div class="right-field-title">Actions</div>
          <div class="right-field-content">
            <button class="archive-button" @click="archiveTask(itemCopy.id)" v-if="!archivedView">
              <mono-icon name="archive"/>
              <span>Archive</span>
            </button>
            <button class="archive-button" @click="restoreTask(itemCopy.id)" v-else>
              <mono-icon name="restore"/>
              <span>Unrchive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { ClientID, TaskId, YDoc } from './injectionKeys'
import { Component, Emit, Inject, Prop, Ref, Vue, InjectReactive } from 'vue-property-decorator'
import Modal from '@/components/legacy/Modal.vue'
import {
  NewUploadResource,
  TagResource,
  TaskCommentResource,
  TaskItemResource,
  UserResource
} from '@/types/resource'
import Field from '@/components/Field.vue'
import PopoverList from '@/components/PopoverList.vue'
import TextareaAutoresize from '@/components/TextareaAutoresize.vue'
import ImageViewer from '@/components/ImageViewer.vue'
import { Optional } from '@/types/core'
import TaskComment from '@/views/Task/TaskComment.vue'
import TagsPopover from '@/views/Task/TagsPopover.vue'
import MemberPopover from '@/views/Task/MemberPopover.vue'
import DueDatePopover from '@/views/Task/DueDatePopover.vue'
import Avatar from 'vue-avatar'
import * as Y from 'yjs'
import TaskAttachmentView from '@/views/Task/TaskAttachmentView.vue'

import TaskActivities from '@/views/Task/TaskActivities.vue'
import { formatDueDate } from '@/utils/date'
import api from '@/utils/api'
import { ModalInjectedContext, ProfileModal } from '@/components/modal'
import Editor from '@/components/editor'

@Component({
  name: 'TaskModal',
  components: {
    Editor,
    TaskActivities,
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
    ImageViewer
  },
  filters: {
    formatDate (date: Date | string) {
      const dueDate = date instanceof Date ? date : new Date(date)
      return formatDueDate(dueDate, new Date())
    }
  }
})
export default class TaskModal extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly visible!: boolean;

    @Prop({ type: Object, required: true })
    private readonly item!: TaskItemResource;

    @Prop({ type: Boolean })
    private archivedView!: boolean

    @Ref('attachmentFile')
    private readonly attachmentFileRef!: HTMLInputElement

    @Ref('titleEditable')
    private readonly titleEditableRef!: HTMLDivElement

    @Inject('modal')
    modal!: ModalInjectedContext

    @InjectReactive(YDoc)
    private readonly doc!: Y.Map<any>

    @InjectReactive(TaskId)
    private readonly taskId!: string

    @InjectReactive(ClientID)
    private readonly clientId!: Number

    private itemCopy = { ...this.item }
    private isEditingDescription = false
    private commentInput = ''
    private isUploading = false
    private isUpdatingTitle = false
    private isEditingTitle = false
    private isCommenting = false
    private isCapturingFile = false
    private isShowAllAttachment = false
    private attachmentIndex: number|null = null

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

    handleCreateTag (data) {
      this.updateTaskItem({
        ...data,
        action: 'createTag'
      })
    }

    handleUpdateTag (data) {
      this.updateTaskItem({
        ...data,
        action: 'updateTag'
      })
    }

    pickFile () {
      this.attachmentFileRef.click()
    }

    mounted () {
      this.readNotification()
    }

    async readNotification () {
      try {
        await api.patch('/notifications/seen/entity/task/' + this.item.id)
      } catch (e) {
        // Eat any error so user can still continue viewing
      }
    }

    async handleAttachFile () {
      const files = this.attachmentFileRef.files

      if (files && files.length > 0) {
        await this.uploadFiles(files)
      }
    }

    async uploadFiles (files: FileList) {
      this.isUploading = true

      const uploadedFiles : any[] = await Promise.all(
        Array.from(files).map(file => (
          this.$store.dispatch('task/item/upload', {
            task: this.itemCopy,
            file
          })
        ))
      )

      uploadedFiles.forEach((data: any) => {
        const file : NewUploadResource = data?.data?.data
        const attachments = this.item?.attachments

        if (!attachments?.filter((attachment) => attachment.id === file.id).length) attachments?.push(file)
        this.updateTaskItem({ ...this.item, attachments, action: 'uploadFile' })
      })

      this.isUploading = false
    }

    async handleRemoveFile (attachment: NewUploadResource) {
      await this.$store.dispatch('task/item/deleteUpload', {
        task: this.item,
        upload: attachment
      })
      this.itemCopy.attachments = this.item.attachments
      if (this.item.attachments?.length === 0) {
        this.attachmentIndex = null
      }

      this.updateTaskItem({
        ...this.item,
        id: this.item.id,
        action: 'deleteUploadFile'
      })
    }

    handleFileClick (index: number|null) {
      this.attachmentIndex = index
    }

    async saveDescription (description: object) {
      const item = await this.$store.dispatch('task/item/update', {
        id: this.item.id,
        description
      })

      this.updateTaskItem({
        ...item,
        description,
        id: this.item.id,
        title: this.itemCopy.title,
        action: 'updateTaskItemDescription'
      })

      this.itemCopy.description = description
      this.isEditingDescription = false
    }

    cancelDescription () {
      this.isEditingDescription = false
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
        const commentResource: Optional<TaskCommentResource, 'userId' | 'user' | 'createdAt' | 'updatedAt' | 'task'> = {
          id: null,
          content: this.commentInput,
          taskId: this.item.id
        }
        const commentItem = await this.$store.dispatch('task/comment/create', commentResource)
        this.updateTaskItem({
          ...commentItem,
          id: this.item.id,
          title: this.itemCopy.title,
          action: 'createComment'
        })
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

        this.updateTaskItem({
          taskId: this.item.id,
          tagId: tag.id,
          action: 'removeTagFromTask'
        })
      } else {
        await this.$store.dispatch('task/tag/addToTask', {
          taskId: this.item.id,
          tagId: tag.id
        })

        this.updateTaskItem({
          taskId: this.item.id,
          tagId: tag.id,
          action: 'addTagToTask'
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

        this.updateTaskItem({
          taskId: this.item.id,
          userId: member.id,
          action: 'removeAssigneeFromTask'
        })
      } else {
        await this.$store.dispatch('task/item/addAssigneeToTask', {
          taskId: this.item.id,
          userId: member.id,
          user: member
        })

        this.updateTaskItem({
          user: member,
          taskId: this.item.id,
          action: 'addAssigneeToTask'
        })
      }
      const currentBoard = this.$store.state.task.board.current
      this.$emit('getUpdate', currentBoard)
    }

    async handleDateMenu (date: Date) {
      this.itemCopy.dueDate = date
      const item = await this.$store.dispatch('task/item/update', {
        id: this.item.id,
        dueDate: this.itemCopy.dueDate
      })

      this.updateTaskItem({
        ...item,
        id: this.item.id,
        title: this.itemCopy.title,
        action: 'addDueDate'
      })
    }

    async handleDateClear () {
      this.itemCopy.dueDate = null
      const item = await this.$store.dispatch('task/item/update', {
        id: this.item.id,
        dueDate: null
      })

      this.updateTaskItem({
        ...item,
        id: this.item.id,
        title: this.itemCopy.title,
        action: 'removeDueDate'
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
          this.itemCopy.title = this.titleEditableRef.innerText.trim()
          const updateItem = await this.$store.dispatch('task/item/update', {
            id: this.item.id,
            title: this.itemCopy.title
          })
          this.updateTaskItem({
            ...updateItem,
            id: this.item.id,
            title: this.itemCopy.title,
            action: 'updateTaskItemTitle'
          })
          this.isUpdatingTitle = false
          this.isEditingTitle = false
        }
      } else if (cancel) {
        this.titleEditableRef.innerText = this.itemCopy.title.trim()
        this.titleEditableRef.blur()
      }
    }

    private updateTaskItem (data) {
      this.doc.doc.transact(() => {
        this.doc.set(this.taskId, {
          ...data,
          clientId: this.clientId
        })
      }, this.clientId)
    }

    get colors () {
      return ['#DEFFD9', '#FFE8E8', '#FFEAD2', '#DBF8FF', '#F6DDFF', '#FFF2CC', '#FFDDF1', '#DFE7FF', '#D5D1FF', '#D2E4FF']
    }

    textColor (bgColor: string) {
      const textColor = ['#3A932C', '#C94747', '#DD8435', '#588f9c', '#9C3DBF', '#8c7940', '#883b68', '#394c84', '#47408c', '#2D6FD6']
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
      const files = e.dataTransfer?.files

      e.preventDefault()
      e.stopPropagation()

      this.isCapturingFile = false

      if (files && files.length > 0) {
        await this.uploadFiles(files)
      }
    }

    get maxShownAttachment () {
      if (this.isShowAllAttachment && this.item.attachments) {
        return this.item.attachments.length
      } else if (this.item.attachments && this.item.attachments.length > 0) {
        return this.item.attachments.length > 5 ? 5 : this.item.attachments.length
      }
      return 0
    }

    get textAttachmentState () {
      const textState = this.isShowAllAttachment ? 'Less' : 'More'

      return `Show ${textState}`
    }

    get iconAttachmentState () {
      const iconState = this.isShowAllAttachment ? 'up' : 'down'

      return iconState
    }

    get description () {
      const raw = this.item.description

      let result
      try {
        if (!raw || typeof raw !== 'string') throw new Error()

        result = JSON.parse(raw)
      } catch (e) {
        result = raw || ''
      }

      return result
    }

    get title () {
      return this.item.title
    }

    get assignees () {
      return this.item.assignees
    }

    attachmentState () {
      this.isShowAllAttachment = !this.isShowAllAttachment
    }

    handlePaste (e: ClipboardEvent) {
      e.preventDefault()
      const data = e.clipboardData?.getData('text/plain')
      if (data && this.titleEditableRef) {
        document.execCommand('insertText', false, data)
      }
    }

    async archiveTask (taskId: number) {
      this.close()

      await this.$store.dispatch('task/item/archiveTask', {
        taskId: taskId
      })

      this.updateTaskItem({
        taskId,
        action: 'archiveTaskItem'
      })
    }

    async restoreTask (taskId: number) {
      this.close()

      await this.$store.dispatch('task/item/restoreTask', {
        taskId: taskId
      })

      this.updateTaskItem({
        taskId,
        action: 'restoreTaskItem'
      })
    }

    onUserProfileClose () {
      // Hack, wait a while in case any other process that update current item.
      // It's because this function will be triggered when user open another task modal.
      setTimeout(() => {
        const currentItem = this.$store.state.task.item.current.id
        const closeOldModal = currentItem && currentItem !== this.item.id
        if (closeOldModal) {
          this.$emit('close', { visibilityOnly: true })
        }
      })
    }

    openProfile (user: UserResource) {
      this.modal.open({
        component: ProfileModal,
        attrs: {
          userId: user.id,
          onClose: this.onUserProfileClose
        }
      })
    }
}
</script>

<style lang="postcss" scoped>

  .task-modal-header {
    @apply flex items-start pr-12 pb-2;
    width: 750px;
    font-weight: bold;
    padding-top: 32px;
    padding-left: 40px;
  }

  .task-modal-header-actions {
    @apply flex items-center;

    button {
      width: 20px;
      height: 20px;
    }
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
    color: theme('colors.gray.800');
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    padding-left: 8px;
  }

  .list-title {
    font-weight: normal;
    text-decoration: underline;
    cursor: default;
  }

  .task-modal-body {
    @apply flex items-start p-12 pb-8 pt-4 relative;
    width: 750px;
  }

  .task-left {
    flex: 1 0 0;
    width: 448px;
  }

  .task-right {
    @apply ml-8;
    flex: 0 1 auto;
    width: 182px;
  }

  .action-label {
    @apply pb-2;

    color: theme("colors.gray.900");
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .actions {
    display: flex;

    button, .popover-container {
      margin-right: .5rem;
    }

    button, .popover-trigger {
      padding: 8px 12px 7px 9.33px !important;
    }

    button {
      border-color: #EFF1F6
    }
  }

  .popover-trigger {
    &.show {
      button {
        background: rgba(216, 55, 80, 0.16);
      }
    }
  }

  .actions .popover-container {
    flex: 0 1 auto;

    .btn {
      @apply px-3 w-full;

      & .stroke-current {
        fill: none;
      }

      & span {
        padding-left: 8px;
      }
    }
  }

  .actions > .btn {
    @apply items-center px-3 ml-0 py-2;
    flex: 0 1 auto;
    transition: all 0.3s ease;

    & .stroke-current {
      fill: none;
    }

    & span {
      @apply pl-2;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
    }
  }

  .task-description {
    @apply mb-6;
  }

  .description-title {
    @apply flex items-center justify-start;

    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.05em;
    text-transform: uppercase;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .description-title-placeholder {
    @apply uppercase pr-2;
    color: theme("colors.gray.900");
  }

  .description-input {
    @apply my-2;
  }

  .description-input-actions {
    @apply flex items-center justify-end mt-4;

    .save, .cancel {
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-align: right;
    }

    .save {
      color: theme("colors.primary.default");
      margin-left: 16px;
    }

    .cancel {
      color: theme("colors.gray.400");
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
    line-height: 14px;
  }

  .right-field-content {
    color: rgba(theme("colors.gray.800"), 0.5);

    span {
      font-size: 14px;
    }
  }

  .tags,
  .assignees {
    @apply flex flex-wrap justify-start;
    max-width: 200px;
  }

  .tag {
    @apply mr-2 rounded inline-flex items-center mb-2;
    color: #fff;
    cursor: pointer;
    font-weight: bold;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    padding: 8px;

    span {
      font-size: 11px;
    }

    svg {
      visibility: hidden;
    }

    &:hover {
      svg {
        visibility: visible;
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
        display: flex;
        align-items: center;
        padding: 4px;
        padding-left: 3px;
        width: 24px;
        height: 24px;
        background: rgba(theme("colors.gray.100"), 0.5);
        color: theme("colors.gray.900");
        border-radius: 24px;
        cursor: pointer;

        svg {
          margin-left: 1px;
        }

        div, span, svg {
          &:focus {
            outline: none;
          }
        }

        &:hover{
          background: rgba(216, 55, 80, 0.16);
          color: theme("colors.primary.default");
        }
      }

      .vue-avatar--wrapper {
        width: 28px !important;
        height: 28px !important;
        font: 10px / 13px theme("fontFamily.primary") !important;
        float: left;
        border: 2px solid #FFF;
        margin-left: -7px;
        letter-spacing: 0.03em;
        color: #fff !important;
        background-position: center center impor !important;
      }
    }

    .popover-trigger.show {
      .addmember-button {
        color: #fff;
        background: theme("colors.primary.default");
      }
    }
  }

  .task-actions {
    @apply mb-6;

    .uploading {
      border-color: theme("colors.primary.default");
      color: theme("colors.primary.default");
      background: none;
    }

    button {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      height: 32px;

      &:hover {
        background: theme("colors.gray.100");
        border-color: theme("colors.gray.100");
        color: theme("colors.gray.900");
      }
    }
  }
  .attachment-file {
    @apply hidden;
  }

  .attachments {
    @apply flex flex-col;
  }

  .task-modal-title-editable {
    @apply rounded;
    width: 480px;
    line-height: 29px;
    transition: padding 0.5s ease, border 0.3s ease;
    border: 2px solid white;
    outline: none;
    padding: 6px 8px 5px 6px;

    &:focus {
      outline: none;
      border-color: rgba(47, 128, 237, 0.75);
      box-shadow: 0 0 0 2px rgba(47, 128, 237, 0.25);
    }
  }
  .due-date-box {
    @apply rounded p-2;
    background: rgba(theme("colors.gray.100"), 0.3);
    color: theme("colors.gray.900");
    font-weight: 600;
    font-size: 13px;
  }

  .input-description {
    height: 5rem;
    transition: none;
  }

  .task-drag-capture {
    @apply z-50 absolute flex items-center justify-center text-3xl flex-col;
    color: theme("colors.gray.900");
    top: 0;
    width: 100%;
    height: 90%;
    border: 2px dashed theme("colors.primary.default");
    font-size: 16px;
    line-height: 19px;
    box-sizing: border-box;
    border-radius: 4px;
    margin: 0 0 2rem 0;
    width: 650px;
    background: #fff;

    svg {
      color: theme("colors.primary.default");
    }
  }

  .created-by {
    @apply flex;

    padding-left: 6px;

    .vue-avatar--wrapper {
      width: 24px !important;
      height: 24px !important;
      font: 10px / 13px theme("fontFamily.primary") !important;
      float: left;
      border: 0;
      margin-left: -7px;
      letter-spacing: 0.03em;
      color: #fff !important;
    }

    .label {
      @apply self-center ml-2;

      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
    }
  }

  .archive-button {
    @apply flex items-center;

    background: #EFF1F6;
    color: theme("colors.gray.900");
    padding: 8px;
    padding-right: 12px;
    border-radius: 4px;

    span {
      margin-left: 8px;
    }

    &:hover {
      background: theme("colors.gray.100");
      color: theme("colors.gray.900");
    }
  }

  .task-attachments {
    margin-top: 24px;

    .attachments-label {
      @apply uppercase pb-2;

      color: theme("colors.gray.900");
      font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 0.05em;
    }
  }

  .show-attachments {
    @apply flex items-center;

    cursor: pointer;
    line-height: 17px;
    color: theme("colors.gray.800");
  }

</style>

<style lang="postcss">
.ql-editor {
  line-height: 1.5rem;
  font-size: 15px;
  font-size: 15px;
  min-height: 180px;
  max-height: 650px;
}

.description-input.is-disabled {
  .ql-toolbar,
  .ql-blank,
  .description-input-actions {
    @apply hidden;
  }

  .ql-editor {
    @apply min-h-0 p-0;
  }

  .ql-disabled {
    @apply border-none;
  }
}

.assignees {
  .popover-container {
    margin-top: 2px;
    margin-bottom: 4px;

    .popover-trigger {
      height: 24px;
    }
  }
}
</style>
