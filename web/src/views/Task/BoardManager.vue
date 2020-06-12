<template>
  <div class="board-manager">
    <div v-if="isKanban" class="board-kanban">
      <TaskLane v-for="list in board.taskLists" :list="list" :key="list.id"></TaskLane>
      <TaskLane default-inputting
                v-if="isInputtingNewList"
                :list="newList"
                @save="clearNewList"
                @cancel="clearNewList"/>
      <TaskAddLane @click="addList" v-if="!isInputtingNewList"/>
    </div>
    <div v-else class="board-list">
      <TaskList v-for="list in lists" :list="list" :key="list.id"></TaskList>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskBoardResource, TaskBoardType, TaskListResource } from '@/types/resource'
import TaskList from '@/views/Task/List/TaskList.vue'
import TaskLane from '@/views/Task/Kanban/TaskLane.vue'
import TaskAddLane from '@/views/Task/Kanban/TaskAddLane.vue'

  /**
   * Responsible for managing CRUD operations on board and determining how to render the board
   */
  @Component({
    name: 'BoardManager',
    components: { TaskAddLane, TaskLane, TaskList }
  })
export default class BoardManager extends Vue {
    @Prop({ type: Object, required: true })
    private readonly board!: TaskBoardResource;

    private readonly lists!: TaskListResource[];
    private isInputtingNewList = false
    private newList: TaskListResource | null = null

    get isKanban () {
      return this.board.type === TaskBoardType.Kanban
    }

    clearNewList () {
      this.newList = null
      this.isInputtingNewList = false
    }

    addList () {
      this.isInputtingNewList = true
      this.newList = {
        board: this.board,
        boardId: this.board.id,
        createdAt: null,
        description: null,
        id: null,
        position: this.board.taskLists.length + 1,
        spaceId: null,
        tasks: [],
        title: '',
        updatedAt: null,
        userId: null
      }
    }
}
</script>

<style lang="postcss" scoped>

  .board-manager {
    @apply h-full;
  }

  .board-list {
    @apply p-4;
  }

  .board-kanban {
    @apply flex flex-row items-start p-4 overflow-x-scroll h-full;
  }

</style>
