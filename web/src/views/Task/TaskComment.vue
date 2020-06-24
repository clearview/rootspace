<template>
  <li class="comment">
    <div class="comment-left">
      <div class="comment-avatar">
        <img :src="`https://i.pravatar.cc/32?u=${comment.userId}`" alt="User Avatar">
      </div>
    </div>
    <div class="comment-right">
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
        >
      </div>
      <div class="comment-actions" v-if="!isEditMode && user.id === comment.userId">
        <button class="btn btn-link" @click="enterEditMode">
          <v-icon name="edit" viewbox="32"/>
          <span>Edit</span>
        </button>
        <button class="btn btn-link" @click="deleteComment">
          <v-icon name="trash"/>
          <span>Delete</span>
        </button>
      </div>
      <div v-else class="comment-actions">
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

  @Component({
    name: 'TaskComment',
    computed: {
      ...mapState('auth', {
        user: 'user'
      })
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
      await this.$store.dispatch('task/board/refresh')
    }

    async updateComment () {
      this.exitEditMode()
      await this.$store.dispatch('task/comment/update', this.commentCopy)
      await this.$store.dispatch('task/board/refresh')
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
      @apply mt-4;
    }
  }

  .comment-left {
    flex: 0 0 auto;
  }

  .comment-right {
    @apply ml-4;
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
    @apply p-3 text-base leading-tight rounded;
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
</style>
