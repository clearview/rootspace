<template>
  <li class="comment">
    <div class="comment-left">
      <div class="comment-avatar">
        <avatar :size="32" :username="`${comment.user.firstName} ${comment.user.lastName}`" alt="User Avatar"></avatar>
      </div>
    </div>
    <div class="comment-right">
      <header class="comment-header">
        <div class="header-name">
          {{comment.user.firstName}} {{comment.user.lastName}}
        </div>
        <div class="header-date">
          {{comment.createdAt | formatDate}}
        </div>
        <div class="header-actions" v-if="user.id === comment.userId">
          <Popover top="38px" :with-close="false">
            <template #default="{ hide }">
              <div class="action-line" @click="hide();enterEditMode()">
                <v-icon name="edit"></v-icon>
                <div class="action-line-text">
                  Edit
                </div>
              </div>
              <div class="action-separator"></div>
              <div class="action-line danger" @click="hide();deleteComment()">
                <v-icon name="trash"></v-icon>
                <div class="action-line-text">
                  Delete
                </div>
              </div>
            </template>
            <template #trigger="{ visible }">
              <button class="btn btn-link" :class="{'btn-link-primary': visible}">
                <v-icon name="ellipsis" viewbox="20" size="1.25rem"/>
              </button>
            </template>
          </Popover>
        </div>
      </header>
      <div v-if="!isEditMode" class="comment-content">
        {{comment.content}}
      </div>
      <div v-show="isEditMode" class="comment-input">
        <input
          ref="input"
          type="text"
          class="input"
          placeholder="Write a comment…"
          v-model="commentCopy.content"
          @keypress.enter.prevent="updateComment"
          @keyup.esc="exitEditMod"
        >
      </div>
      <div v-if="isEditMode" class="comment-actions">
        <button class="btn btn-link" @click="exitEditMode">
          <v-icon name="close2" viewbox="20"/>
        </button>
        <button class="btn btn-primary" @click="updateComment">
          Save
        </button>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { TaskCommentResource } from '@/types/resource'
import { mapState } from 'vuex'
import Avatar from 'vue-avatar'
import Popover from '@/components/Popover.vue'
import { formatRelativeTo } from '@/utils/date'

  @Component({
    name: 'TaskComment',
    components: {
      Avatar,
      Popover
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

    private readonly user!: Record<string, string>;

    private isEditMode = false
    private commentCopy = { ...this.comment }

    @Ref('input')
    private readonly inputRef!: HTMLInputElement;

    async deleteComment () {
      await this.$store.dispatch('task/comment/destroy', this.comment)
    }

    async updateComment () {
      this.exitEditMode()
      await this.$store.dispatch('task/comment/update', {
        id: this.comment.id,
        content: this.commentCopy.content
      })
    }

    enterEditMode () {
      this.isEditMode = true
      Vue.nextTick().then(() => {
        this.inputRef.focus()
      })
    }

    exitEditMode () {
      this.isEditMode = false
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
  }

  .comment-actions {
    @apply mt-2 flex items-center justify-end;

    .btn {
      @apply px-4;

      .stroke-current {
        fill: none;
      }

      > span {
        @apply ml-2;
      }
    }
  }
  .input {
    @apply w-full;
  }

  .comment-header {
    @apply mb-1;
    display: flex;
    align-items: center;
  }
  .header-name {
    font-weight: bold;
    font-size: 14px;
    flex: 0 0 auto;
    color: theme("colors.gray.900");
  }
  .header-date {
    @apply ml-2;
    flex: 0 0 auto;
    color: theme("colors.gray.800");
    font-size: 14px;
  }
  .header-actions {
    @apply ml-auto;
    flex: 0 0 auto;
    .btn {
      @apply p-0;
      color: theme("colors.gray.400");
    }
    .btn-link-primary {
      color: theme("colors.primary.default");
    }
  }
  .action-line {
    @apply flex items-center py-2 px-4 my-1;
    font-size: 14px;
    font-weight: 600;
    min-width: 168px;
    color: theme("colors.gray.900");
    stroke-width: 3px;
    cursor: pointer;

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
</style>
