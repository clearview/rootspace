<template>
  <div class="task-lane" @dragstart="tryDrag" :draggable="!canDrag">
    <div class="list-input" v-show="isInputtingNewLane">
      <input ref="newInput" v-model="listCopy.title" placeholder="Enter a title for this list…"
             @keyup.enter="save"
             @keyup.esc="cancel"
             class="list-input-field"/>
      <div class="list-actions">
        <button class="btn btn-link" @click="cancel">
          <v-icon name="close" size="1.5rem" title="Close"/>
        </button>
        <button class="btn btn-primary" :disabled="!canSave" @click="save">Add List</button>
      </div>
    </div>
    <div class="lane" v-show="!isInputtingNewLane" :style="{background: list.settings.color}">
      <header class="header" >
        <input v-model="listCopy.title" v-show="isEditingLane" class="list-input-field header-input" @keyup.enter="save"
               @keyup.esc="cancel" ref="editInput"/>
        <h4 v-if="!isEditingLane" class="header-title" @click="enterEditMode">{{list.title}}</h4>
        <Popover top="38px" :with-close="false" @trigger="handleMenuTrigger">
          <template #default="{ hide }">
            <div class="action-line">
              <v-icon class="action-icon" name="color" viewbox="18" size="18px"></v-icon>
              <div class="action-line-text">
                Change Color
              </div>
              <v-icon name="right2" viewbox="20" size="20px" class="action-arrow"></v-icon>
              <div class="action-submenu">
                <div class="colors">
                  <div class="color" v-for="color in colors" :key="color" :style="{background: color}" @click="selectColor(color);hide()">
                    <span class="icon-checkmark" v-if="list.settings.color === color"><v-icon size="9.33 6.67" name="checkmark" viewbox="12 9" /></span>
                  </div>
                  <div class="color-default" @click="selectColor(defaultColor);hide()">
                    Default
                  </div>
                </div>
              </div>
            </div>
            <div class="action-separator"></div>
            <div class="action-line danger" @click="hide();handleMenu('delete')">
              <v-icon name="archive" viewbox="16" size="18px"></v-icon>
              <div class="action-line-text">
                Archive
              </div>
            </div>
          </template>
          <template #trigger="{ visible }">
            <button class="btn btn-link" :class="{'btn-link-primary': visible}">
              <v-icon name="ellipsis" viewbox="20" size="1.25rem"/>
            </button>
          </template>
        </Popover>
      </header>
      <div class="list-actions" v-if="isEditingLane">
        <button class="btn btn-link" @click="cancel">
          <v-icon name="close" size="1.5rem" title="Close"/>
        </button>
        <button class="btn btn-primary" :disabled="!canSave" @click="save">Save</button>
      </div>
      <main class="cards" ref="cardContainer"
      :class="{'top-shadow': containerShadowTop, 'bottom-shadow': containerShadowBottom }">
        <Draggable :disabled="!canDrag" :value="orderedCards" group="cards" v-bind="dragOptions" @start="drag=true" @end="drag=false" @change="reorder">
            <TaskCard v-for="item in orderedCards" :can-drag="canDrag" :item="item" :key="item.id" />
        </Draggable>

        <TaskCard default-inputting
                  class="card-input"
                  v-if="isInputtingNewItem"
                  :item="newItem"
                  @save="clearNewItem"
                  @cancel="clearNewItem"/>
      </main>
      <footer class="footer">
        <TaskAddCard v-if="!isInputtingNewItem" @click="addCard"/>
      </footer>
    </div>
    <div class="drag-block" v-show="isDragBlocked" ref="dragBlock">
      It's not possible to move tasks and lists in search results
    </div>
  </div>
</template>

<script lang="ts">
import Draggable, { MovedEvent } from 'vuedraggable'

import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator'
import Icon from '@/components/icon/Icon.vue'
import { TaskItemResource, TaskItemStatus, TaskListResource } from '@/types/resource'
import TaskCard from '@/views/Task/Kanban/TaskCard.vue'
import { required } from 'vuelidate/lib/validators'
import TaskAddCard from '@/views/Task/Kanban/TaskAddCard.vue'
import { Optional } from '@/types/core'
import Popover from '@/components/Popover.vue'
import PopoverList from '@/components/PopoverList.vue'
import { getNextPosition, getReorderIndex, getReorderPosition } from '@/utils/reorder'

@Component({
  name: 'TaskLane',
  components: {
    PopoverList,
    Popover,
    TaskAddCard,
    TaskCard,
    Icon,
    Draggable
  },
  validations: {
    listCopy: {
      title: { required }
    }
  }
})
export default class TaskLane extends Vue {
    @Prop({ type: Object, required: true })
    private readonly list!: Optional<TaskListResource, 'createdAt' | 'updatedAt' | 'userId'>

    @Prop({ type: Boolean, default: false })
    private readonly defaultInputting!: boolean

    @Prop({ type: Boolean, default: true })
    private readonly canDrag!: boolean

    @Ref('newInput')
    private readonly newInput!: HTMLInputElement;

    @Ref('editInput')
    private readonly editInput!: HTMLInputElement;

    @Ref('cardContainer')
    private readonly cardContainerRef!: HTMLInputElement;

    @Ref('dragBlock')
    private readonly dragBlock!: HTMLDivElement;

    private isDragBlocked = false

    private isInputting = this.defaultInputting
    private listCopy: Optional<TaskListResource, 'createdAt' | 'updatedAt' | 'userId'> = { ...this.list }
    private isInputtingNewItem = false
    private newItem: Optional<TaskItemResource, 'createdAt' | 'updatedAt' | 'userId'> | null = null
    private drag = false
    private containerShadowTop = false
    private containerShadowBottom = false

    private get orderedCards () {
      if (!this.list.tasks) {
        return []
      }
      return [...this.list.tasks].sort((a, b) => a.position - b.position).map(item => ({ ...item, list: this.list }))
    }

    private get canSave () {
      return !this.$v.$invalid
    }

    private get isInputtingNewLane () {
      return this.isInputting && this.listCopy.id === null
    }

    private get isEditingLane () {
      return this.isInputting && this.listCopy.id !== null
    }

    private get colors () {
      return ['rgba(55,216,139, 0.25)', 'rgba(255,90,90, 0.25)', 'rgba(255,186,104,0.5)', 'rgba(86,204,242,0.3)', 'rgba(187,107,217,0.3)', 'rgba(242,201,76,0.3)', 'rgba(193,34,130,0.2)', 'rgba(109,115,132,0.2)']
    }

    private get scrollColors () {
      return ['#D0D6E2', '#D0D6E2', '#98C6B0', '#E29999', '#D5C497']
    }

    private get defaultColor () {
      return 'rgb(247, 248, 250)'
    }

    private get defaultScrollColor () {
      return '#0005'
    }

    mounted () {
      this.setScrollColor()
    }

    private setScrollColor () {
      const color = this.list.settings.color || this.defaultColor
      const index = this.colors.indexOf(color)
      let scrollColor = this.scrollColors[index] || this.defaultScrollColor
      if (index !== -1 && this.cardContainerRef) {
        scrollColor = this.scrollColors[index]
        this.cardContainerRef.style.setProperty('scroll-color', scrollColor)
      }
    }

    private tryDrag (e: DragEvent) {
      if (!this.canDrag) {
        e.preventDefault()
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

    @Emit('drag:disable')
    private enterEditMode () {
      this.isInputting = true
      Vue.nextTick().then(() => {
        this.editInput.focus()
      })
    }

    private async reorder (data: MovedEvent<TaskItemResource>) {
      if (data.added) {
        const [prevIndex, nextIndex] = getReorderIndex(getNextPosition(this.list.tasks.length), data.added.newIndex)
        const prev = this.orderedCards[prevIndex]
        const next = this.orderedCards[nextIndex]

        const newPos = getReorderPosition(prev ? prev.position : 0, next ? next.position : getNextPosition(this.list.tasks.length))

        await this.$store.dispatch('task/item/update', {
          id: data.added.element.id,
          listId: this.list.id,
          position: newPos
        })
      }
      if (data.moved) {
        const [prevIndex, nextIndex] = getReorderIndex(data.moved.oldIndex, data.moved.newIndex)
        const prev = this.orderedCards[prevIndex]
        const next = this.orderedCards[nextIndex]
        const newPos = getReorderPosition(prev ? prev.position : 0, next ? next.position : getNextPosition(this.list.tasks.length))
        await this.$store.dispatch('task/item/update', {
          id: data.moved.element.id,
          listId: this.list.id,
          position: newPos
        })
      }
    }

    get dragOptions () {
      return {
        animation: 50,
        delay: 14,
        group: 'cards',
        disabled: false,
        ghostClass: 'ghost',
        forceFallback: true,
        fallbackClass: 'ghost-floating',
        emptyInsertThreshold: 64
      }
    }

    @Emit('save')
    async save () {
      if (!this.canSave) {
        return
      }
      if (this.listCopy.id === null) {
        await this.$store.dispatch('task/list/create', this.listCopy)
      } else {
        await this.$store.dispatch('task/list/update', {
          id: this.list.id,
          title: this.listCopy.title
        })
      }
      this.isInputting = false
      return this.listCopy
    }

    created () {
      Vue.nextTick(() => {
        if (this.isInputtingNewLane) {
          this.newInput.focus()
        }
      })
    }

    @Emit('cancel')
    @Emit('drag:disable')
    cancel () {
      if (this.list) {
        this.listCopy = { ...this.list }
      }
      this.isInputting = false
      return true
    }

    @Emit('drag:enable')
    clearNewItem () {
      this.newItem = null
      this.isInputtingNewItem = false
    }

    @Emit('drag:disable')
    addCard () {
      this.isInputtingNewItem = true
      this.newItem = {
        assignees: null,
        attachments: null,
        description: null,
        dueDate: null,
        id: null,
        list: this.list as TaskListResource,
        listId: this.list.id,
        spaceId: this.list.spaceId,
        tags: null,
        taskComments: [],
        title: '',
        slug: null,
        status: TaskItemStatus.Open,
        position: getNextPosition(this.list.tasks ? this.list.tasks.length : 1, this.orderedCards && this.orderedCards.length > 0 ? this.orderedCards[this.orderedCards.length - 1].position : 0)
      }
      Vue.nextTick().then(() => {
        this.cardContainerRef.scrollTop = this.cardContainerRef.scrollHeight
      })
    }

    async selectColor (color: string) {
      await this.$store.dispatch('task/list/update', {
        id: this.list.id,
        settings: { ...this.listCopy.settings, color }
      })
      this.setScrollColor()
    }

    handleMenuTrigger (visible: boolean) {
      if (visible) {
        this.$emit('drag:disable')
      } else {
        this.$emit('drag:enable')
      }
    }

    async handleMenu (value: string) {
      switch (value) {
        case 'delete':
          await this.$store.dispatch('task/list/destroy', this.listCopy)
          break
      }
    }

    handleCardContainerScroll () {
      this.containerShadowTop = this.cardContainerRef.scrollTop > 0
      this.containerShadowBottom = this.cardContainerRef.scrollTop < (this.cardContainerRef.scrollHeight - this.cardContainerRef.offsetHeight)
    }
}
</script>

<style lang="postcss" scoped>

  .flip-list-move {
    transition: transform 0.5s;
  }

  .task-lane {
    @apply flex flex-col h-full;
    width: 300px;
    flex: 0 0 auto;
  }

  .task-lane ~ .task-lane {
    @apply ml-4;
  }

  .lane {
    @apply p-4 rounded;
    /*To prevent transparency during drag and drop*/
    background: rgba(247, 248,250, 1);
    display: flex;
    flex-direction: column;
    max-height: 100%;
  }

  .header {
    @apply flex items-center mb-2;
    &.with-shadow{
      box-shadow: 0 8px 12px -8px rgba(0,0,0,.15);
      z-index: 50;
    }

    .popover-trigger.show button {
      .stroke-current {
        color: theme("colors.primary.default");
      }
    }
  }

  .header-title {
    @apply text-base mr-2;
    font-weight: bold;
    color: theme("colors.gray.900");
    flex: 1 1 auto;
  }

  .btn-link {
    @apply py-2 px-2;

    background-color: unset !important;

    &:hover {
      background-color: unset;

      .stroke-current {
        color: theme("colors.primary.default");
      }
    }
  }

  .btn-link .stroke-current {
    stroke-width: 3px;
    color: theme("colors.gray.400");
  }

  .list-input {
    @apply rounded p-4 rounded;
    background: rgba(theme("colors.gray.100"), 0.25);
  }

  .list-input-field {
    @apply rounded p-2 w-full text-base;
    border: solid thin theme("colors.gray.100");
  }

  .list-actions {
    @apply flex items-center justify-end mt-2 mb-3;

    .btn {
      @apply px-4;
      flex: 0 0 auto;
    }
  }

  .cards {
    @apply relative;
    padding: 0 0 2px 0;
    margin:0 -10px 10px;
    overflow-y: auto;
    /*Firefox*/
    scrollbar-color: var(--scroll-color, '#0003');
    scrollbar-width: 6px;
  }

  .cards::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 6px;
  }

  .cards::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: var(--scroll-color, #0003);
    box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }

  .card-input {
    @apply mt-4;
    padding: 0 8px;
  }

  .lane-transition-group {
  }
  .ghost {
    opacity:0.5;
  }
  .ghost-floating {
    @apply shadow shadow-xl;
    opacity: 1 !important;
    transform: rotate(-5deg);
  }

  .top-shadow{
    border-top: solid 1px theme("colors.gray.100");
  }

  .bottom-shadow{
    border-bottom: solid 1px theme("colors.gray.100");
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

  .action-line {
    @apply flex items-center py-2 px-4 my-1 relative;
    font-size: 13px;
    font-weight: 600;
    width: 168px;
    color: theme("colors.gray.900");
    stroke-width: 3px;
    cursor: pointer;

    .action-submenu {
      @apply p-4 absolute;
      opacity: 0;
      visibility: hidden;
      background: #fff;
      transition: all 0.3s ease;
      left: 168px;
      top: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.11);
      border-radius: 0 4px 4px 4px;

      .colors {
        .color {
          @apply flex items-center justify-center rounded mb-2;
          width: 104px;
          height: 1.75rem;
          border:solid 2px transparent;
          transition: all 0.15s ease;
          &:hover{
            border:solid 2px theme("colors.primary.default");
          }
          .icon-checkmark {
            color: transparent;
            opacity: 1;
            right: auto;
          }
        }
        .color-default {
          @apply flex items-center justify-center rounded p-1;
          font-style: normal;
          font-weight: bold;
          font-size: 14px;
          text-align: center;
          color: #444754;
          border:solid 2px transparent;
          transition: all 0.15s ease;
          &:hover{
            border:solid 2px theme("colors.primary.default");
          }
        }
      }
    }

    &:hover{
      background: #F0F2F5;
      .action-submenu {
        visibility: visible;
        opacity: 1;
      }
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
  .action-arrow{
    @apply ml-2;
    color: theme("colors.gray.400");
  }

</style>
