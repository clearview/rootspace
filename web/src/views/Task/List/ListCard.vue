<template>
  <div class="task-card" @dragstart="tryDrag" :draggable="!canDrag">
    <div class="item-input-cloak" v-if="isInputtingNewCard" @click.self="cancel"></div>
    <div class="item-input" v-show="isInputtingNewCard">
      <div class="title-editable-placeholder" v-if="isShowingPlaceholder" @click="focusTitleEditable">
        Enter a title for this card…
      </div>
      <div class="title-editable" ref="titleEditable" contenteditable @keypress.enter.prevent="save" @keyup="calculateShowPlaceholder"
        @input="titleBackbone = $event.target.innerText" @paste="handlePaste">{{itemCopy.title}}</div>
      <div class="item-actions">
        <button v-if="isInputtingNewCard" class="btn btn-primary" @click="save" :disabled="!canSave">
          <v-icon name="checkmark" size="14px" viewbox="12 9" title="Checkmark"/>
        </button>
        <button class="btn btn-link" @click="cancel">
          <v-icon name="close" size="20px" title="Close"/>
        </button>
      </div>
    </div>
    <div v-if="!isInputtingNewCard" class="card" @click="openModal()" :class="{opacite}">
      <div class="drag">
        <v-icon name="drag" size="20px" viewbox="20"></v-icon>
      </div>
      <div class="color"></div>
      <div class="card-item" ref="cardItem">
          <div class="title" ref="title">
            {{item.title}}
          </div>
          <div class="tags" ref="tags">
            <ul>
              <li v-for="(tag, index) in displayedTags" :key="index">
                <div :style="{background: tag.color, color: textColor(tag.color)}" class="tag" :content="tag.label" v-tippy>
                  {{ tag.label }}
                </div>
              </li>
              <div v-if="moreTags" :style="{background: '#DDD', color: '#333'}" class="tag" :content="moreTags.labels" v-tippy>
                {{moreTags.count}}+
              </div>
            </ul>
          </div>
          <div class="date" v-show="itemCopy.dueDate" :content="formatDateReadable(itemCopy.dueDate)" v-tippy ref="date">
            {{ formatDate(itemCopy.dueDate) }}
          </div>
          <div class="icon icon-attachment" v-show="item.attachments && item.attachments.length > 0" ref="attachment">
            <v-icon name="attachment" viewbox="20" size="20" :withTitle="false" content="Attachment(s)" v-tippy/>
          </div>
          <div class="icon icon-comment" v-show="item.taskComments.length > 0" ref="comment">
            <v-icon name="message" viewbox="20" size="20" :withTitle="false" content="Comment(s)" v-tippy/>
          </div>
          <ul class="assignees" v-show="item.assignees && item.assignees.length > 0" ref="assignees">
            <li v-if="moreAssignees" class="assignee">
              <avatar :size="28" :content="moreAssignees.labels" :username="moreAssignees.count+' +'" v-tippy></avatar>
            </li>
            <li v-for="(assignee, index) in displayedAssignees" :key="index" class="assignee">
              <avatar :size="28" :src="assignee.avatar && assignee.avatar.versions ? assignee.avatar.versions.default.location : ''" :content="memberName(assignee)" :username="memberName(assignee)" v-tippy></avatar>
            </li>
          </ul>
      </div>
    </div>
    <TaskModal v-if="showModal" @close="closeModal" :item="item" :visible="showModal"></TaskModal>
    <div class="drag-block" v-show="isDragBlocked" ref="dragBlock">
      It's not possible to move tasks and lists in search results
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { TaskBoardResource, TaskItemResource, UserResource } from '@/types/resource'
import { required } from 'vuelidate/lib/validators'
import { Optional } from '@/types/core'
import TaskModal from '@/views/Task/TaskModal.vue'
import moment from 'moment'
import Avatar from 'vue-avatar'

@Component({
  name: 'ListCard',
  components: {
    TaskModal,
    Avatar
  },
  validations: {
    titleBackbone: { required }
  }
})
export default class ListCard extends Vue {
    @Prop({ type: Object, required: true })
    private readonly item!: Optional<TaskItemResource, 'updatedAt' | 'createdAt' | 'userId'>

    @Prop({ type: Boolean, default: false })
    private readonly defaultInputting!: boolean

    @Prop({ type: Boolean, default: true })
    private readonly canDrag!: boolean

    @Prop({ type: Boolean, default: false })
    private readonly opacite!: boolean

    @Ref('titleEditable')
    private readonly titleEditableRef!: HTMLDivElement;

    @Ref('dragBlock')
    private readonly dragBlock!: HTMLDivElement;

    @Ref('title')
    private readonly titleRef!: HTMLDivElement;

    @Ref('cardItem')
    private readonly cardItemRef!: HTMLDivElement;

    @Ref('tags')
    private readonly tagsRef!: HTMLDivElement;

    @Ref('date')
    private readonly dateRef!: HTMLDivElement;

    @Ref('attachment')
    private readonly attachmentRef!: HTMLDivElement;

    @Ref('comment')
    private readonly commentRef!: HTMLDivElement;

    @Ref('assignees')
    private readonly assigneesRef!: HTMLUListElement;

    private isInputting = this.defaultInputting
    private itemCopy: Optional<TaskItemResource, 'updatedAt' | 'createdAt' | 'userId'> = { ...this.item }
    private showModal = false
    private isDragBlocked = false
    private isShowingPlaceholder = true
    private titleBackbone = ''
    private tagMax = 5
    private assigneeMax = 5

    private get isProcessing () {
      return this.$store.state.task.item.processing
    }

    private get isInputtingNewCard () {
      return this.isInputting && this.itemCopy.id === null
    }

    private get canSave () {
      return !this.$v.$invalid && !this.isProcessing
    }

    private get moreTags () {
      if (this.item.tags && this.item.tags.length > this.tagMax) {
        return {
          count: this.item.tags.length - this.tagMax,
          labels: this.item.tags.slice(this.tagMax, this.item.tags.length).map((next) => next.label).join(', ')
        }
      }
      return null
    }

    private get moreAssignees () {
      if (this.item.assignees && this.item.assignees.length > this.assigneeMax) {
        return {
          count: this.item.assignees.length - this.assigneeMax,
          labels: this.item.assignees.slice(this.assigneeMax, this.item.assignees.length).map((next) => next.firstName).join(', ')
        }
      }
      return null
    }

    private get displayedTags () {
      if (this.item.tags && this.item.tags.length > 0) {
        return this.item.tags.slice(0, this.tagMax)
      }
      return []
    }

    private get displayedAssignees () {
      if (this.item.assignees && this.item.assignees.length > 0) {
        return this.item.assignees.slice(0, this.assigneeMax)
      }
      return []
    }

    tryDrag (e: DragEvent) {
      e.preventDefault()
      if (!this.canDrag) {
        if (!this.isDragBlocked) {
          this.isDragBlocked = true
          this.dragBlock.style.top = e.clientY - 5 + 'px'
          this.dragBlock.style.left = e.clientX - 5 + 'px'
          setTimeout(() => {
            this.isDragBlocked = false
          }, 3000)
        }
      }
    }

    async save () {
      if (!this.canSave) {
        return
      }
      if (this.itemCopy.id === null) {
        this.titleEditableRef.blur()
        await this.$store.dispatch('task/item/create', { ...this.itemCopy, title: this.titleEditableRef.innerText.trim(), list: undefined })
      } else {
        await this.$store.dispatch('task/item/update', {
          id: this.item.id,
          title: this.itemCopy.title
        })
      }
      this.isInputting = false
      this.$emit('save', this.itemCopy)
      return this.itemCopy
    }

    @Emit('cancel')
    cancel () {
      this.itemCopy = { ...this.item }
      this.isInputting = false
      return true
    }

    get board (): TaskBoardResource | null {
      return this.$store.state.task.board.current
    }

    openModal () {
      if (this.board?.id && this.item.id) {
        this.$router.push({
          name: 'TaskPageWithItem',
          params: {
            id: this.board.id.toString(),
            item: this.item.id.toString(),
            slug: this.item.slug || '-'
          }
        })
        this.$store.commit('task/item/setCurrent', this.item)
        this.showModal = true
      }
    }

    closeModal () {
      if (this.board?.id && this.item.id) {
        this.$router.replace({
          name: 'TaskPage',
          params: {
            id: this.board.id.toString()
          }
        })
      }
      this.$store.commit('task/item/setCurrent', null)
      this.showModal = false
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
        (itemCopy.attachments && itemCopy.attachments.length > 0) ||
      (itemCopy.taskComments && itemCopy.taskComments.length > 0) ||
      (itemCopy.assignees && itemCopy.assignees.length > 0)
    }

    get colors () {
      return ['#DEFFD9', '#FFE8E8', '#FFEAD2', '#DBF8FF', '#F6DDFF', '#FFF2CC', '#FFDDF1', '#DFE7FF', '#D5D1FF', '#D2E4FF']
    }

    textColor (bgColor: string) {
      const textColor = ['#64a55a', '#ab5d5d', '#9a7a56', '#588f9c', '#733988', '#8c7940', '#883b68', '#394c84', '#47408c', '#5c89cc']
      const getBgPosition = this.colors.indexOf(bgColor)

      return textColor[getBgPosition]
    }

    @Watch('item')
    updateItem (val: Optional<TaskItemResource, 'updatedAt' | 'createdAt' | 'userId'>) {
      this.itemCopy = val
      this.invalidateMeasurement()
    }

    invalidateMeasurement () {
      if (!this.titleRef) {
        return
      }
      const occupied = this.titleRef.offsetWidth +
        this.tagsRef.offsetWidth +
        this.dateRef.offsetWidth +
        this.attachmentRef.offsetWidth +
        this.commentRef.offsetWidth +
        this.assigneesRef.offsetWidth
      const spare = this.cardItemRef.offsetWidth - occupied
      // Space too small to display all tags
      if (spare <= 0) {
        // 100 is the max width of tag
        const reductionCost = Math.ceil((Math.abs(spare)) / 100)
        this.tagMax -= reductionCost
      } else if (spare > 100) {
        const additiveCost = Math.floor(spare / 100)
        this.tagMax += additiveCost
      }
    }

    mounted () {
      if (this.$route.name === 'TaskPageWithItem') {
        const itemId = parseInt(this.$route.params.item)
        if (itemId === this.item.id) {
          this.$store.commit('task/item/setCurrent', this.item)
          this.showModal = true
        }
      }
      this.invalidateMeasurement()
      window.addEventListener('resize', this.invalidateMeasurement)
    }

    destroyed () {
      window.removeEventListener('resize', this.invalidateMeasurement)
    }

    created () {
      Vue.nextTick(() => {
        if (this.isInputtingNewCard) {
          this.focusTitleEditable()
        }
      })
    }

    focusTitleEditable () {
      if (this.titleEditableRef) {
        this.titleEditableRef.focus()
      }
    }

    calculateShowPlaceholder () {
      if (this.titleEditableRef) {
        this.isShowingPlaceholder = this.titleEditableRef.innerText.trim().length <= 0
      }
    }

    handlePaste (e: ClipboardEvent) {
      e.preventDefault()
      const data = e.clipboardData?.getData('text/plain')
      if (data && this.titleEditableRef) {
        document.execCommand('insertText', false, data)
        this.titleBackbone = data
      }
    }
}
</script>
<style>
.assignees > .assignee > .vue-avatar--wrapper > span{
  margin: 1px 1px 0 0 !important;
  color: #fff;
}
</style>
<style lang="postcss" scoped>

  .drag {
    margin-left: 8px;
    cursor: grab;
    visibility: hidden;
  }
  .drag .stroke-current{
    stroke: none;
  }

  .task-card {
    @apply relative;
    cursor: pointer;
    &:first-child{
      margin-top: 8px;
    }
    &.dragged {
      opacity: 0.5;
    }
    &.overed{
    }
  }

  .task-card ~ .task-card {
    margin-top: 8px;
  }

  .item-input-cloak {
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100vh;
    z-index: 50;
  }
  .item-input {
    @apply relative;
    max-width: 400px;
    z-index: 51;
    margin-left: 44px;
    padding: 8px 0;
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
    @apply flex items-center justify-end;
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);

    .btn {
      padding: 8px;
      font-size: 14px;
      line-height: 14px;
      flex: 0 0 auto;
      height: auto;
    }
    .btn-link {
      padding: 6px;
    }
  }

  .item-textarea {
    @apply rounded p-2 w-full text-base;
    border: solid thin theme("colors.gray.100");
  }

  .card {
    @apply flex items-center rounded;
    padding: 8px;
    height: 40px;
    transition: all 0.1s ease;
    &.opacite{
      background: rgba(theme("colors.white.default"), 0.8);
    }
    &:hover {
      background: #F8F9FD;
      .drag {
        visibility: visible;
      }
    }
  }

  .task-card.ghost-floating {
    .card .drag {
      visibility: visible;
    }
  }
  .task-card.ghost {
    .card .drag {
      visibility: hidden;
    }
  }

  .color {
    @apply rounded;
    margin-left: 8px;
    background: theme("colors.gray.100");
    width: 3px;
    height: auto;
    align-self: stretch;
    flex: 0 0 auto;
  }

  .card-item {
    @apply text-base flex flex-row items-center;
    margin-left: 8px;
    flex: 1 1 auto;
    width: 0;

    font-weight: 500;
    color: theme("colors.gray.900");

    .title {
      flex: 0 0 auto;
      max-width: 320px;
      word-break: break-word;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: theme("colors.gray.900");
    }

    .date {
      border-radius: 4px;
      padding: 6px 8px;
      font-size: 10px;
      line-height: 12px;
      font-weight: bold;
      background: #EFF1F6;
      margin-left: 8px;
    }

    .tags {
      @apply flex;
      margin-left: 16px;
      flex: 0 0 auto;

      ul {
        display: flex;
        align-items: center;

        .tag {
          border-radius: 4px;
          padding: 6px 8px;
          color: #fff;
          margin-right: 8px;
          font-size: 11px;
          font-weight: bold;
          line-height: 13px;
          max-width: 100px;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 24px;
        }
      }
    }

    .icon {
      @apply cursor-auto;
      display: inline-block;
      color: theme("colors.gray.400");
      stroke: theme("colors.gray.400");
    }
    .icon-attachment {
      margin-left: 16px;
    }
    .icon-comment {
      margin-left: 8px;
    }

    .assignees {
      @apply flex flex-wrap flex-row-reverse;
      margin-left: 16px;
      flex: 0 0 auto;
      .assignee {
        .vue-avatar--wrapper {
          border: 2px solid #FFF;
          margin-left: -6px;
          color: #fff !important;
        }
      }
    }

  }

  .drag-block {
    @apply p-2 fixed z-50 rounded shadow shadow-lg;
    animation: shake 0.5s ease, fadeOut 0.5s 2.5s ease-out;
    background: theme("colors.danger.default");
    color: #fff;
  }

  @keyframes fadeOut {
    from{
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .title-editable-placeholder {
    @apply absolute;
    user-select: none;
    font-size: 16px;
    line-height: 19px;
    z-index: 1;
    top: 11px;
    left: 11px;
    color: theme("colors.gray.400");
    font-weight: 500;
    opacity: 0.75;
  }
  .title-editable {
    background: theme("colors.white.default");
    outline: none;
    font-weight: 500;
    color: theme("colors.gray.900");
    border-left: 3px solid theme("colors.gray.100");
    white-space: -moz-pre-wrap !important;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    white-space: pre-wrap;       /* css-3 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
    white-space: -webkit-pre-wrap; /* Newer versions of Chrome/Safari*/
    word-break: break-word;
    white-space: normal;
    padding: 2px 9px;
    font-size: 16px;
  }

  @keyframes shake {
    0% {
      transform: translateX(0%)
    }
    25% {
      transform: translateX(-1%)
    }
    50% {
      transform: translateX(1%)
    }
    75% {
      transform: translateX(-1%)
    }
    100% {
      transform: translateX(0%)
    }
  }
</style>
