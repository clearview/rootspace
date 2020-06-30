<template>
  <div class="task-lane">
    <div class="list-input" v-show="isInputtingNewLane">
      <input ref="newInput" v-model="listCopy.title" placeholder="Enter a title for this list…"
             class="list-input-field"/>
      <div class="list-actions">
        <button class="btn btn-link" @click="cancel">
          <v-icon name="close" size="1.5rem"/>
        </button>
        <button class="btn btn-primary" :disabled="!canSave" @click="save">Add List</button>
      </div>
    </div>
    <div class="lane" v-show="!isInputtingNewLane">
      <header class="header">
        <input v-model="listCopy.title" v-show="isEditingLane" class="list-input-field header-input" @keyup.enter="save"
               @keyup.esc="cancel" ref="editInput"/>
        <h4 v-if="!isEditingLane" class="header-title" @click="enterEditMode">{{list.title}}</h4>
        <PopoverList :items="[{label: 'Delete', value: 'delete'}]" @input="handleMenu">
          <template slot="trigger">
            <v-icon v-if="!isEditingLane" name="ellipsis" size="1.5rem" class="header-icon" @click="cancel"/>
          </template>
        </PopoverList>
      </header>
      <div class="list-actions" v-if="isEditingLane">
        <button class="btn btn-link" @click="cancel">
          <v-icon name="close" size="1.5rem"/>
        </button>
        <button class="btn btn-primary" :disabled="!canSave" @click="save">Save</button>
      </div>
      <main class="cards">
        <Draggable :value="orderedCards" group="cards" v-bind="dragOptions" @start="drag=true" @end="drag=false" @change="reorder">
            <TaskCard v-for="item in orderedCards"
                  :item="item" :key="item.id"/>
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

    @Ref('newInput')
    private readonly newInput!: HTMLInputElement;

    @Ref('editInput')
    private readonly editInput!: HTMLInputElement;

    private isInputting = this.defaultInputting
    private listCopy: Optional<TaskListResource, 'createdAt' | 'updatedAt' | 'userId'> = { ...this.list }
    private isInputtingNewItem = false
    private newItem: Optional<TaskItemResource, 'createdAt' | 'updatedAt' | 'userId'> | null = null
    private drag = false

    private get orderedCards () {
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
      await this.$store.dispatch('task/board/refresh')
    }

    get dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }

    @Emit('save')
    async save () {
      if (!this.canSave) {
        return
      }
      if (this.listCopy.id === null) {
        this.listCopy = await this.$store.dispatch('task/list/create', this.listCopy)
      } else {
        this.listCopy = await this.$store.dispatch('task/list/update', this.listCopy)
      }
      await this.$store.dispatch('task/board/refresh')
      this.isInputting = false
      return this.listCopy
    }

    @Emit('cancel')
    cancel () {
      if (this.list) {
        this.listCopy = { ...this.list }
      }
      this.isInputting = false
      return true
    }

    clearNewItem () {
      this.newItem = null
      this.isInputtingNewItem = false
    }

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
        status: TaskItemStatus.Open,
        position: getNextPosition(this.list.tasks.length)
      }
    }

    async handleMenu (value: string) {
      switch (value) {
        case 'delete':
          await this.$store.dispatch('task/list/destroy', this.listCopy)
          break
      }
      await this.$store.dispatch('task/board/refresh')
    }
}
</script>

<style lang="postcss" scoped>

  .flip-list-move {
    transition: transform 0.5s;
  }

  .task-lane {
    @apply flex flex-col p-4 rounded;
    background: rgba(theme("colors.gray.100"), 0.25);
    width: 300px;
    max-height: 80vh;
    flex: 0 0 auto;
    overflow-y: scroll;
  }

  .task-lane ~ .task-lane {
    @apply ml-4;
  }

  .header {
    @apply flex items-center;
  }

  .header-title {
    @apply text-base;
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
    @apply py-2 px-1;
    overflow-y: auto;
  }
  .card-input {
    @apply mt-4;
  }

  .lane-transition-group {
  }
</style>
