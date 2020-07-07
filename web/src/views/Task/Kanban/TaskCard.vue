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
        <div class="header">
          <div class="title">
            {{itemCopy.title}}
          </div>
          <div class="date">
            {{ formatDate(itemCopy.createdAt) }}
          </div>
        </div>
        <div class="content">
          {{ itemCopy.description }}
        </div>
        <div class="footer">
          <div class="tags">
            <ul>
              <li v-for="(tag, index) in itemCopy.tags" :key="index" :style="{ 'background-color': tag.color }" class="tag">
                {{ tag.label }}
              </li>
            </ul>

            <div class="actions">
              <button class="btn btn-tiny btn-link">
                <v-icon name="attachment" viewbox="20" size="1rem"/>
              </button>
              <button class="btn btn-tiny btn-link">
                <v-icon name="comment" viewbox="16" size="1rem"/>
              </button>
              <!-- taskComments
              attachments -->
              <button class="btn btn-tiny btn-link edit-link" @click="edit">
                <v-icon name="edit" size="1rem"/>
              </button>
            </div>
          </div>
          <ul class="assignees">
            <li v-for="(assignee, index) in itemCopy.assignees" :key="index" class="assignee">
              <avatar :username="memberName(assignee)"></avatar>
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
      return moment(String(taskDate)).format('MM.DD.YYYY')
    }

    memberName (member: UserResource) {
      return `${member.firstName} ${member.lastName}`
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
      }

      .date {
        @apply flex-none rounded px-2 py-1 self-start;

        background: theme("colors.gray.100");
        font-size: .8rem;
      }
    }

    .content {
      @apply pt-2 pb-5;

      color: theme("colors.gray.800");
      font-size: .9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 220px;
    }

    .footer {
      @apply flex justify-between flex-1;

      .tags {
        @apply flex-1 flex justify-start;

        ul {
          @apply flex;
          li {
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

        .actions {
          @apply flex self-start;
        }
      }

      .assignees {
        @apply flex flex-wrap justify-start;

        li {
          @apply px-1;

          display: inline;

          .vue-avatar--wrapper {
            width: 24px !important;
            height: 24px !important;
            font: 11px / 24px Helvetica, Arial, sans-serif !important;
            float: left;
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
