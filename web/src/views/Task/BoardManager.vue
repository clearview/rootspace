<template>
  <div class="board-manager">
    <div v-if="isList" class="board-list">
      <TaskList v-for="list in lists" :list="list" :key="list.id"></TaskList>
    </div>
    <div v-if="isKanban" class="board-kanban">
      <TaskLane v-for="list in board.taskLists" :list="list" :key="list.id"></TaskLane>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskBoardResource, TaskBoardType, TaskListResource } from '@/types/resource'
import TaskList from '@/views/Task/List/TaskList.vue'
import TaskLane from '@/views/Task/Kanban/TaskLane.vue'

  /**
   * Responsible for managing CRUD operations on board and determining how to render the board
   */
  @Component({
    name: 'BoardManager',
    components: { TaskLane, TaskList }
  })
export default class BoardManager extends Vue {
    @Prop({ type: Object, required: true })
    private readonly board!: TaskBoardResource;

    private readonly lists!: TaskListResource[];

    get isList () {
      return this.board.type === TaskBoardType.List
    }

    get isKanban () {
      return this.board.type === TaskBoardType.Kanban
    }

    mounted (): void {
      this.fetchList()
    }

    fetchList (): void {
      this.$store.dispatch('task/list/fetch', { boardId: this.board.id })
    }
}
</script>

<style lang="postcss" scoped>

  .board-list {
    @apply p-4;
  }

  .board-kanban {
    @apply flex flex-row items-start p-4 overflow-x-scroll;
  }

</style>
