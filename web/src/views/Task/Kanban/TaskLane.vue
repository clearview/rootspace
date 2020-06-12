<template>
  <div class="task-lane">
    <div class="list-input" v-show="isInputtingNewLane">
      <input ref="newInput" v-model="listCopy.title" placeholder="Enter a title for this list…"
             class="list-input-field"/>
      <div class="list-actions">
        <button class="btn btn-link" @click="cancel">
          <Icon name="close" size="1.5rem"/>
        </button>
        <button class="btn btn-primary" :disabled="!canSave" @click="save">Add List</button>
      </div>
    </div>
    <div class="lane" v-show="!isInputtingNewLane">
      <header class="header">
        <input v-model="listCopy.title" v-show="isEditingLane" class="list-input-field header-input" @keyup.enter="save"
               @keyup.esc="cancel" ref="editInput"/>
        <h4 v-if="!isEditingLane" class="header-title" @click="enterEditMode">{{list.title}}</h4>
        <Icon v-if="!isEditingLane" name="ellipsis" size="1.5rem" class="header-icon" @click="cancel"/>
      </header>
      <div class="list-actions" v-if="isEditingLane">
        <button class="btn btn-link" @click="cancel">
          <Icon name="close" size="1.5rem"/>
        </button>
        <button class="btn btn-primary" :disabled="!canSave" @click="save">Save</button>
      </div>
      <main class="cards">
        <TaskCard v-for="item in list.tasks"
                  :item="item" :key="item.id"/>

        <TaskCard default-inputting
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
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator'
import Icon from '@/components/icon/Icon.vue'
import { TaskItemResource, TaskItemStatus, TaskListResource } from '@/types/resource'
import TaskCard from '@/views/Task/Kanban/TaskCard.vue'
import { required } from 'vuelidate/lib/validators'
import TaskAddCard from '@/views/Task/Kanban/TaskAddCard.vue'

  @Component({
    name: 'TaskLane',
    components: {
      TaskAddCard,
      TaskCard,
      Icon
    },
    validations: {
      listCopy: {
        title: { required }
      }
    }
  })
export default class TaskLane extends Vue {
    @Prop({ type: Object, required: true })
    private readonly list!: TaskListResource

    @Prop({ type: Boolean, default: false })
    private readonly defaultInputting!: boolean

    @Ref('newInput')
    private readonly newInput!: HTMLInputElement;

    @Ref('editInput')
    private readonly editInput!: HTMLInputElement;

    private isInputting = this.defaultInputting
    private listCopy: TaskListResource = { ...this.list }
    private isInputtingNewItem = false
    private newItem: TaskItemResource | null = null

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
        assignedTo: null,
        attachments: null,
        createdAt: null,
        description: null,
        dueDate: null,
        id: null,
        list: this.list,
        listId: this.list.id,
        spaceId: null,
        tags: null,
        updatedAt: null,
        userId: null,
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
    @apply py-2;
    overflow-y: auto;
  }
</style>
