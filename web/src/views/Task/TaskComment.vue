<template>
  <li class="comment">
    <div class="comment-left">
      <div class="comment-avatar cursor-pointer" @click="openProfile(comment.user)">
        <avatar :src="comment.user.avatar && comment.user.avatar.versions ? comment.user.avatar.versions.default.location : ''" :username="`${comment.user.firstName} ${comment.user.lastName}`"
                :size="32"
                :alt="`${comment.user.firstName} ${comment.user.lastName}`"></avatar>
      </div>
    </div>
    <div class="comment-right">
      <header class="comment-header">
        <div class="header-name cursor-pointer" @click="openProfile(comment.user)">
          {{comment.user.firstName}} {{comment.user.lastName}}
        </div>
        <div class="header-date">
          {{comment.createdAt | formatDate}}
        </div>
        <div class="header-actions" v-if="user.id === comment.userId && !isEditMode">
          <Popover :z-index="1001" :with-close="false" position="bottom-start">
            <template #default="{ hide }">
              <div class="action-line" @click="hide();enterEditMode()">
                <legacy-icon name="edit"></legacy-icon>
                <div class="action-line-text">
                  Edit
                </div>
              </div>
              <div class="action-separator"></div>
              <div class="action-line danger" @click="hide();deleteCommentActionConfirm()">
                <legacy-icon name="trash"></legacy-icon>
                <div class="action-line-text">
                  Delete
                </div>
              </div>
            </template>
            <template #trigger="{ visible }">
              <button class="btn btn-link" :class="{'btn-link-primary': visible}">
                <legacy-icon name="ellipsis" viewbox="20" size="1.25rem"/>
              </button>
            </template>
          </Popover>
        </div>
      </header>
      <div v-if="!isEditMode" class="comment-content" v-html="formatURL(comment.content)"></div>
      <div v-show="isEditMode" class="comment-input">
        <textarea-autoresize
          placeholder="Write a comment…"
          class="comment-textarea"
          v-model="commentCopy.content"
          @cancel-comment="exitEditMode"
          ref="commentTextarea"
        />
      </div>
      <div v-if="isEditMode" class="comment-actions">
        <span class="cancel" @click="exitEditMode">Cancel</span>
        <span class="save" @click="updateComment">Save</span>
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
import { Component, Inject, Prop, Ref, Vue } from 'vue-property-decorator'
import { TaskCommentResource, UserResource } from '@/types/resource'
import { mapState } from 'vuex'
import Avatar from 'vue-avatar'
import TextareaAutoresize from '@/components/TextareaAutoresize.vue'
import Popover from '@/components/Popover.vue'
import VModal from '@/components/legacy/Modal.vue'
import { formatRelativeTo } from '@/utils/date'
import { ProfileModal, ModalInjectedContext } from '@/components/modal'

  @Component({
    name: 'TaskComment',
    components: {
      Avatar,
      TextareaAutoresize,
      Popover,
      VModal
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
    private readonly comment!: TaskCommentResource;

    @Inject('modal')
    modal!: ModalInjectedContext

    private readonly user!: Record<string, string>;

    private isEditMode = false
    private commentCopy = { ...this.comment }

    private deleteComment: any = {
      visible: false,
      id: null,
      alert: null
    }

    @Ref('commentTextarea')
    private readonly commentRef!: HTMLInputElement

    deleteCommentActionConfirm () {
      this.deleteComment.visible = true
    }

    async deleteCommentAction (comment: TaskCommentResource) {
      this.deleteComment.visible = false
      await this.$store.dispatch('task/comment/destroy', comment)
    }

    async updateComment () {
      this.comment.content = this.commentCopy.content
      this.exitEditMode()
      await this.$store.dispatch('task/comment/update', {
        id: this.comment.id,
        content: this.commentCopy.content
      })
    }

    enterEditMode () {
      this.isEditMode = true
      Vue.nextTick().then(() => {
        this.commentRef.focus()
      })
    }

    exitEditMode () {
      this.isEditMode = false
    }

    formatURL (comment: string) {
      // eslint-disable-next-line
      const URLMatcher = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm // es

      const withLinks = comment.replace(URLMatcher, match => `<a href="${match}" target="_blank">${match}</a>`)

      return withLinks
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
    background: theme("colors.gray.100");

    img {
      @apply rounded-full;
    }
  }

  .comment-content {
    @apply p-2 leading-tight rounded;

    font-size: 14px;
    line-height: 17px;
    color: theme("colors.gray.900");
    background: rgba(theme("colors.gray.100"), 0.3);
    white-space: pre-line;
    word-break: break-word;
  }
  .comment-actions {
    @apply flex items-center justify-end;

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
    color: theme("colors.gray.900");
    line-height: 20px;
  }
  .header-date {
    @apply ml-2;
    flex: 0 0 auto;
    color: theme("colors.gray.800");
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
      color: theme("colors.gray.400");
    }

    .btn-link-primary {
      color: theme("colors.primary.default");
      background: none !important;
    }
  }
  .action-line {
    @apply flex items-center py-2 px-4 my-1;
    min-width: 168px;
    color: theme("colors.gray.900");
    stroke-width: 3px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;

    &:hover{
      background: #F0F2F5;
    }
    &.danger {
      color: theme("colors.danger.default");
    }
  }
  .action-line-text {
    @apply ml-2;
    flex: 1 1 auto;
  }
  .action-separator{
    @apply my-1;
    height:1px;
    background: theme("colors.gray.100");
  }

  .btn-link {
    background-color: unset !important;
    padding: 0;
    height: 20px;

    &:hover {
      background-color: unset;

      .stroke-current {
        color: theme("colors.primary.default");
      }
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
