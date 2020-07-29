<template>
  <div class="task-lane" @dragstart="tryDrag" :draggable="!canDrag">
    <div class="list-input" v-show="isInputtingNewLane">
      <input ref="newInput" v-model="listCopy.title" placeholder="Enter a title for this list…"
             class="list-input-field"/>
      <div class="list-actions">
        <button class="btn btn-link" @click="cancel">
          <v-icon name="close" size="1.5rem" title="Close"/>
        </button>
        <button class="btn btn-primary" :disabled="!canSave" @click="save">Add List</button>
      </div>
    </div>
    <div class="lane" v-show="!isInputtingNewLane">
      <header class="header" >
        <input v-model="listCopy.title" v-show="isEditingLane" class="list-input-field header-input" @keyup.enter="save"
               @keyup.esc="cancel" ref="editInput"/>
        <h4 v-if="!isEditingLane" class="header-title" @click="enterEditMode">{{list.title}}</h4>
        <PopoverList :items="[{label: 'Delete', value: 'delete'}]" @input="handleMenu" v-if="!isEditingLane">
          <template slot="trigger">
            <button class="btn btn-icon bg-transparent" @click="cancel">
              <v-icon  name="ellipsis" size="1rem" class="header-icon" viewbox="20"/>
            </button>
          </template>
        </PopoverList>
      </header>
      <div class="list-actions" v-if="isEditingLane">
        <button class="btn btn-link" @click="cancel">
          <v-icon name="close" size="1.5rem" title="Close"/>
        </button>
        <button class="btn btn-primary" :disabled="!canSave" @click="save">Save</button>
      </div>
      <main class="cards" ref="cardContainer" @scroll="handleCardContainerScroll"
      :class="{'top-shadow': containerShadowTop, 'bottom-shadow': containerShadowBottom, 'has-scroll': calculateLaneHasScroll()}">
        <Draggable :disabled="!canDrag" :value="orderedCards" group="cards" v-bind="dragOptions" @start="drag=true" @end="drag=false" @change="reorder">
            <TaskCard v-for="item in orderedCards" :can-drag="canDrag" :item="item" :key="item.id"/>
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

    calculateLaneHasScroll () {
      if (this.cardContainerRef) {
        return this.cardContainerRef.scrollHeight > this.cardContainerRef.clientHeight
      }
      return false
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
    @apply flex items-center pb-2;
    &.with-shadow{
      box-shadow: 0 8px 12px -8px rgba(0,0,0,.15);
      z-index: 50;
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
    @apply flex items-center justify-end mt-2;

    .btn {
      @apply px-4;
      flex: 0 0 auto;
    }
  }

  .cards {
    @apply py-2 relative;
    padding-left: 0.1rem;
    padding-right: 0.1rem;
    overflow-y: auto;
    &.has-scroll {
      @apply pr-3;
    }
  }

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }

  .card-input {
    @apply mt-4;
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

</style>
