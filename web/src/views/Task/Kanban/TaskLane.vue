<template>
  <div class="task-lane">
    <header class="header">
      <input v-model="listCopy.title" v-if="isInputting" class="header-input" @keypress.enter="save"
             @keypress.esc="cancel"/>
      <h4 v-else class="header-title">{{list.title}}</h4>

      <Icon v-if="isInputting" name="close" size="1.5rem" class="header-icon"/>
      <Icon v-else name="ellipsis" size="1.5rem" class="header-icon" @click="cancel"/>
    </header>
    <main class="cards">
      <TaskCard :is-inputting="isItemInputting(task)" v-for="task in list.tasks"
                :item="task" :key="task.id" @click="toggleInputting(task, true)" @save="saveItem(task, $event)"
                @cancel="toggleInputting(task, false)"/>

      <TaskCard v-if="isNew" is-inputting
                :item="newItem" @save="saveNewItem($event)"
                @cancel="cancelNew"/>
    </main>
    <footer class="footer">
      <button class="add-card-button" v-if="!isNew" @click="addCard">
        <Icon class="add-card-button-icon" name="plus" size="1.5rem"/>
        <span class="add-card-button-label">Add Card</span>
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import Icon from '@/components/icon/Icon.vue'
import { TaskItemResource, TaskItemStatus, TaskListResource } from '@/types/resource'
import TaskCard from '@/views/Task/Kanban/TaskCard.vue'

  @Component({
    name: 'TaskLane',
    components: {
      TaskCard,
      Icon
    }
  })
export default class TaskLane extends Vue {
    @Prop({ type: Object, required: true })
    private readonly list!: TaskListResource

    @Prop({ type: Boolean, default: false })
    private readonly isInputting!: boolean

    private readonly inputtings: Record<number, boolean> = {}
    private listCopy: TaskListResource = { ...this.list }
    private isNew = false
    private newItem: TaskItemResource | null = null

    @Emit('cancel')
    cancel () {

    }

    @Emit('save')
    save () {
      return this.listCopy
    }

    isItemInputting (task: TaskItemResource) {
      if (task.id !== undefined) {
        return this.inputtings[task.id]
      }
      return false
    }

    toggleInputting (task: TaskItemResource, value: boolean) {
      if (task.id !== undefined) {
        Vue.set(this.inputtings, task.id, value)
      }
    }

    saveItem (item: TaskItemResource, $event: TaskItemResource) {
      item.title = $event.title
      this.toggleInputting(item, false)
    }

    saveNewItem ($event: TaskItemResource) {
      $event.listId = this.list.id
      this.$store.dispatch('task/item/create', $event)
      this.isNew = false
    }

    cancelNew () {
      this.newItem = null
      this.isNew = false
    }

    addCard () {
      this.isNew = true
      this.newItem = {
        title: '',
        status: TaskItemStatus.Open,
        position: this.list.tasks.length + 1
      }
    }
}
</script>

<style lang="postcss" scoped>

  .task-lane {
    @apply flex flex-col p-4 rounded;
    background: rgba(theme("colors.gray.100"), 0.25);
    width: 300px;
    max-height: 80vh;
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

  .cards {
    @apply py-2;
    overflow-y: auto;
  }

  .add-card-button {
    @apply flex items-center justify-center p-2 rounded outline-none w-full;
    color: theme("colors.gray.400");
    transition: all 0.3s ease;
    font-weight: bold;

    .stroke-current {
      stroke-width: 3px;
    }

    &-icon {
      flex: 0 0 auto;
    }

    &-label {
      flex: 0 0 auto;
    }

    &:hover {
      background: rgba(theme("colors.gray.100"), 0.25);
    }

    &:active {
      background: theme("colors.gray.100");
      color: theme("colors.gray.900");
    }
  }
</style>
