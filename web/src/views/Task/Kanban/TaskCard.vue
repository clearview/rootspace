<template>
  <div class="task-card">
    <div class="item-input" v-show="isInputtingNewCard || isEditingCard">
      <input ref="textarea" v-model="itemCopy.title" placeholder="Enter a title for this card…"
                class="item-textarea" @keyup.enter="save" @keyup.esc="cancel"/>
      <div class="item-actions">
        <button class="btn btn-link" @click="cancel">
          <v-icon name="close" size="1.5rem"/>
        </button>
        <button v-if="isInputtingNewCard" class="btn btn-primary" @click="save" :disabled="!canSave">Add Card</button>
        <button v-if="isEditingCard" class="btn btn-primary" @click="save" :disabled="!canSave">Save</button>
      </div>
    </div>
    <div v-if="!isInputtingNewCard && !isEditingCard" class="card" @click="openModal()">
      <div class="color"></div>
      <div class="card-item">
        <div class="header" :class="{ 'mb-8': isHasFooter(itemCopy) }">
          <div class="title">
            {{itemCopy.title}}
          </div>
          <div class="date" v-if="itemCopy.dueDate">
            <tippy :content="formatDateReadable(itemCopy.dueDate)" arrow>
              <template v-slot:trigger>
                  {{ formatDate(itemCopy.dueDate) }}
              </template>
            </tippy>
          </div>
        </div>
        <div class="footer" v-if="isHasFooter(itemCopy)">
          <div class="tags">
            <ul>
              <li v-for="(tag, index) in itemCopy.tags" :key="index">
                <div :style="{background: opacityColor(tag.color), color: tag.color}" class="tag">
                  {{ tag.label }}
                </div>
              </li>
              <li v-if="itemCopy.attachments">
                <tippy content="Attachment(s)" arrow>
                  <template v-slot:trigger>
                    <span class="icon">
                      <v-icon name="attachment" viewbox="20" size="1rem" :withTitle="false"/>
                    </span>
                  </template>
                </tippy>
              </li>
              <li v-if="itemCopy.taskComments.length > 0">
                <tippy content="Comment(s)" arrow>
                  <template v-slot:trigger>
                    <span class="icon">
                      <v-icon name="comment" viewbox="16" size="1rem" :withTitle="false"/>
                    </span>
                  </template>
                </tippy>
              </li>
            </ul>
          </div>
          <ul class="assignees">
            <li v-for="(assignee, index) in itemCopy.assignees" :key="index" class="assignee">
              <tippy :content="memberName(assignee)" arrow>
                <template v-slot:trigger>
                  <avatar :username="memberName(assignee)"></avatar>
                </template>
              </tippy>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <TaskModal @close="showModal = false" :item="item" :visible="showModal"></TaskModal>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator'
import { TaskItemResource, UserResource } from '@/types/resource'
import { required } from 'vuelidate/lib/validators'
import { Optional } from '@/types/core'
import TaskModal from '@/views/Task/TaskModal.vue'
import moment from 'moment'
import Avatar from 'vue-avatar'

  @Component({
    name: 'TaskCard',
    components: {
      TaskModal,
      Avatar
    },
    validations: {
      itemCopy: {
        title: { required }
      }
    }
  })
export default class TaskCard extends Vue {
    @Prop({ type: Object, required: true })
    private readonly item!: Optional<TaskItemResource, 'updatedAt' | 'createdAt' | 'userId'>

    @Prop({ type: Boolean, default: false })
    private readonly defaultInputting!: boolean

    @Ref('textarea')
    private readonly textarea!: HTMLTextAreaElement;

    private isInputting = this.defaultInputting
    private itemCopy: Optional<TaskItemResource, 'updatedAt' | 'createdAt' | 'userId'> = { ...this.item }
    private showModal = false

    private get isInputtingNewCard () {
      return this.isInputting && this.itemCopy.id === null
    }

    private get isEditingCard () {
      return this.isInputting && this.itemCopy.id !== null
    }

    private get canSave () {
      return !this.$v.$invalid
    }

    @Emit('save')
    async save () {
      if (this.itemCopy.id === null) {
        this.itemCopy = (await this.$store.dispatch('task/item/create', this.itemCopy)).data
      } else {
        this.itemCopy = (await this.$store.dispatch('task/item/update', this.itemCopy)).data
      }
      if (this.item.list) {
        await this.$store.dispatch('task/board/refresh')
      }
      this.isInputting = false
      console.log(this.itemCopy)
      return this.itemCopy
    }

    @Emit('cancel')
    cancel () {
      this.itemCopy = { ...this.item }
      this.isInputting = false
      return true
    }

    @Emit('edit')
    edit () {
      this.isInputting = true
      Vue.nextTick().then(() => {
        this.textarea.focus()
      })
    }

    openModal () {
      this.$store.commit('task/item/setCurrent', this.item)
      this.showModal = true
    }

    formatDate (taskDate: string) {
      return moment(String(taskDate)).format('DD.MM.YYYY')
    }

    formatDateReadable (taskDate: string) {
      return moment(String(taskDate)).format('MMMM Do, YYYY')
    }

    memberName (member: UserResource) {
      return `${member.firstName} ${member.lastName}`
    }

    isHasFooter (itemCopy: Optional<TaskItemResource, 'updatedAt' | 'createdAt' | 'userId'>) {
      return (itemCopy.tags && itemCopy.tags.length > 0) ||
      itemCopy.attachments ||
      (itemCopy.taskComments && itemCopy.taskComments.length > 0) ||
      (itemCopy.assignees && itemCopy.assignees.length > 0)
    }

    opacityColor (color: string) {
      return `${color}33`
    }
}
</script>

<style lang="postcss" scoped>
  .task-card {
    cursor: pointer;
    &.dragged {
      opacity: 0.5;
    }
    &.overed{
    }
  }

  .task-card ~ .task-card {
    @apply mt-3
  }

  .item-input {

  }

  .btn-link {
    @apply py-1 px-1;
    cursor: default;
  }

  .btn-link .stroke-current {
    stroke-width: 3px;
    color: theme("colors.gray.400");
  }

  .item-actions {
    @apply flex items-center justify-end mt-2;

    .btn {
      @apply px-4;
      flex: 0 0 auto;
    }
  }

  .item-textarea {
    @apply rounded p-2 w-full text-base;
    border: solid thin theme("colors.gray.100");
  }

  .card {
    @apply p-2 flex items-center rounded;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    background: theme("colors.white.default");

    &:hover .edit-link {
      visibility: visible;
      opacity: 1;
    }
  }
  .edit-link {
    transition: all 0.3s ease;
    visibility: hidden;
    opacity: 0;
    cursor: pointer;
  }

  .color {
    @apply rounded;
    background: theme("colors.gray.100");
    width: 4px;
    height: auto;
    align-self: stretch;
    flex: 0 0 auto;
  }

  .card-item {
    @apply ml-2 text-base flex flex-1 flex-col;

    font-weight: 500;
    color: theme("colors.gray.900");

    .header {
      @apply flex justify-between flex-1;

      .title {
        @apply flex-1;

        word-break: break-word;
      }

      .date {
        @apply flex-none rounded px-2 py-1 self-start;

        background: theme("colors.gray.100");
        font-size: .8rem;
      }
    }

    /* .content {
      @apply pt-2 pb-5;

      color: theme("colors.gray.800");
      font-size: .9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 220px;
    } */

    .footer {
      /* @apply flex justify-between flex-1; */
      @apply block;

      width: 240px;

      .tags {
        @apply flex-1 flex justify-start;

        float: left;

        ul {
          @apply block;

          li {
            display: inline-block;
          }

          .tag {
            @apply px-2 py-1 rounded self-start;

            display: inline;
            color: #fff;
            margin-right: 5px;
            font-size: 10px;
            line-height: 12px;

            /* identical to box height */
            letter-spacing: 0.03em;
            text-transform: uppercase;
          }
        }

        /* .actions {
          @apply flex self-start;
        } */

        .icon {
          @apply p-1 cursor-auto;

          width: 26px;
          height: 26px;
          display: block;
          color: theme("colors.gray.400");

          svg {
            display: inline;
          }
        }
      }

      .assignees {
        @apply flex flex-wrap justify-start flex-row-reverse;

        float: right;
        margin-top: 4px;

        li {
          .vue-avatar--wrapper {
            width: 24px !important;
            height: 24px !important;
            font: 7px / 10px Helvetica, Arial, sans-serif !important;
            float: left;
            border: 2px solid #FFF;
            margin-left: -5px;
          }
        }
      }
    }
  }

  .overed-container{
    height: 40px;
    background: red;
  }
</style>
