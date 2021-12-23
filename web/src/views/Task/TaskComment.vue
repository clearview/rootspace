<template>
  <li class="comment">
    <div class="comment-left">
      <div
        class="comment-avatar cursor-pointer"
        @click="openProfile(comment.user)"
      >
        <avatar
          :src="
            comment.user.avatar && comment.user.avatar.versions
              ? comment.user.avatar.versions.default.location
              : ''
          "
          :username="`${comment.user.firstName} ${comment.user.lastName}`"
          :size="32"
          :alt="`${comment.user.firstName} ${comment.user.lastName}`"
        ></avatar>
      </div>
    </div>
    <div class="comment-right">
      <header class="comment-header">
        <div
          class="header-name cursor-pointer"
          @click="openProfile(comment.user)"
        >
          {{ comment.user.firstName }} {{ comment.user.lastName }}
        </div>
        <div class="header-date">
          {{ comment.createdAt | formatDate }}
        </div>
        <div
          class="header-actions"
          v-if="user.id === comment.userId && !isEditMode"
        >
          <Popover :z-index="1001" :with-close="false" position="bottom-start">
            <template #default="{ hide }">
              <div
                class="action-line"
                @click="
                  hide()
                  enterEditMode()
                "
              >
                <legacy-icon name="edit"></legacy-icon>
                <div class="action-line-text">Edit</div>
              </div>
              <div class="action-separator"></div>
              <div
                class="action-line danger"
                @click="
                  hide()
                  deleteCommentActionConfirm()
                "
              >
                <legacy-icon name="trash"></legacy-icon>
                <div class="action-line-text">Delete</div>
              </div>
            </template>
            <template #trigger="{ visible }">
              <button
                class="btn btn-link"
                :class="{ 'btn-link-primary': visible }"
              >
                <legacy-icon name="ellipsis" viewbox="20" size="1.25rem" />
              </button>
            </template>
          </Popover>
        </div>
      </header>
      <SimpleEditor
        ref="simpleEditor"
        :editable="isEditMode"
        v-model="commentContent"
        @save="updateComment"
        @reset="resetComment"
      />
      <div v-if="isEditMode" class="comment-actions">
        <span class="cancel" @click="resetComment">Cancel</span>
        <span class="save" @click="this.$refs.simpleEditor.save">Save</span>
      </div>
    </div>

    <v-modal
      title="Delete Comment"
      :visible="deleteComment.visible"
      confirmText="Yes"
      @cancel="deleteComment.visible = false"
      @confirm="deleteCommentAction(comment)"
      portal="secondary"
    >
      <div class="modal-body text-center">
        Are you sure you want to delete this comment?
      </div>
    </v-modal>
  </li>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator'
import { TaskCommentResource, UserResource } from '@/types/resource'
import { mapState } from 'vuex'
import Avatar from 'vue-avatar'
import Popover from '@/components/Popover.vue'
import VModal from '@/components/legacy/Modal.vue'
import { formatRelativeTo } from '@/utils/date'
import { ProfileModal, ModalInjectedContext } from '@/components/modal'
import SimpleEditor from '@/components/editor/SimpleEditor.vue'

@Component({
  name: 'TaskComment',
  components: {
    Avatar,
    Popover,
    VModal,
    SimpleEditor
  },
  computed: {
    ...mapState('auth', {
      user: 'user'
    })
  },
  filters: {
    formatDate (date: Date | string) {
      const dueDate = date instanceof Date ? date : new Date(date)
      return formatRelativeTo(dueDate, new Date())
    }
  }
})
export default class TaskComment extends Vue {
  @Prop({ type: Object, required: true })
  private readonly comment!: TaskCommentResource

  @Inject('modal')
  modal!: ModalInjectedContext

  private readonly user!: Record<string, string>

  private isEditMode = false
  private commentCopy = { ...this.comment }
  private deleteComment: any = {
    visible: false,
    id: null,
    alert: null
  }

  deleteCommentActionConfirm () {
    this.deleteComment.visible = true
  }

  async deleteCommentAction (comment: TaskCommentResource) {
    this.deleteComment.visible = false
    await this.$store.dispatch('task/comment/destroy', comment)
  }

  async updateComment (comment: object) {
    this.exitEditMode()
    await this.$store.dispatch('task/comment/update', {
      id: this.comment.id,
      content: JSON.stringify(comment)
    })
  }

  get commentContent () {
    const raw = this.commentCopy.content

    let result
    try {
      if (!raw || typeof raw !== 'string') throw new Error()

      result = JSON.parse(raw)
    } catch (e) {
      result = raw || ''
    }

    return result
  }

  enterEditMode () {
    this.isEditMode = true
  }

  exitEditMode () {
    this.isEditMode = false
  }

  resetComment () {
    this.commentCopy = this.comment
    this.$refs.simpleEditor?.editor.setContent(this.commentContent)
    this.exitEditMode()
  }

  openProfile (user: UserResource) {
    this.modal.open({
      component: ProfileModal,
      attrs: {
        userId: user.id
      }
    })
  }
}
</script>

<style lang="postcss" scoped>
.comment {
  @apply flex items-start;

  & ~ & {
    @apply mt-6;
  }
}

.comment-left {
  flex: 0 0 auto;
}

.comment-right {
  @apply ml-2;
  flex: 1 1 auto;
}

.comment-avatar {
  @apply flex items-center justify-center rounded-full;
  width: 32px;
  height: 32px;
  background: theme('colors.gray.100');

  img {
    @apply rounded-full;
  }
}

.input {
  @apply w-full;

  height: auto;
  resize: none;
  overflow: hidden;
  line-height: 17px;
}

.comment-header {
  @apply mb-1;
  display: flex;
}
.header-name {
  font-weight: bold;
  font-size: 14px;
  flex: 0 0 auto;
  color: theme('colors.gray.900');
  line-height: 20px;
}
.header-date {
  @apply ml-2;
  flex: 0 0 auto;
  color: theme('colors.gray.800');
  font-size: 13px;
  line-height: 19px;
}
.header-actions {
  @apply ml-auto;
  flex: 0 0 auto;

  button {
    width: 20px;
    height: 19px;
  }

  .btn {
    @apply p-0;
    color: theme('colors.gray.400');
  }

  .btn-link-primary {
    color: theme('colors.primary.default');
    background: none !important;
  }
}
.action-line {
  @apply flex items-center py-2 px-4 my-1;
  min-width: 168px;
  color: theme('colors.gray.900');
  stroke-width: 3px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;

  &:hover {
    background: #f0f2f5;
  }
  &.danger {
    color: theme('colors.danger.default');
  }
}
.action-line-text {
  @apply ml-2;
  flex: 1 1 auto;
}
.action-separator {
  @apply my-1;
  height: 1px;
  background: theme('colors.gray.100');
}

.btn-link {
  background-color: unset !important;
  padding: 0;
  height: 20px;

  &:hover {
    background-color: unset;

    .stroke-current {
      color: theme('colors.primary.default');
    }
  }
}

.comment-actions {
  @apply flex items-center justify-end mt-4;
  .save,
  .cancel {
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    text-align: right;
  }
  .save {
    color: theme('colors.primary.default');
    margin-left: 16px;
  }
  .cancel {
    color: theme('colors.gray.400');
  }
}
</style>

<style lang="postcss">
.comment-content {
  a {
    border-bottom: 1px dashed;
  }
}
</style>
