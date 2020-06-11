<template>
<div class="board-manager">
  <div v-if="isList" class="board-list">
    <TaskList v-for="list in lists" :list="list" :key="list.id"></TaskList>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskBoardResource, TaskBoardType, TaskListResource } from '@/types/resource'
import { mapState } from 'vuex'
import TaskList from '@/views/Task/List/TaskList.vue'

/**
 * Responsible for managing CRUD operations on board and determining how to render the board
 */
@Component({
  name: 'BoardManager',
  components: { TaskList },
  computed: {
    ...mapState('task/list', {
      lists: 'data'
    })
  }
})
export default class BoardManager extends Vue {
  @Prop({ type: Object, required: true })
  private readonly board!: TaskBoardResource;

  @Prop({ type: Number, required: true })
  private readonly type!: TaskBoardType;

  private readonly lists!: TaskListResource[];

  get isList () {
    return this.type === TaskBoardType.List
  }

  get isKanban () {
    return this.type === TaskBoardType.Kanban
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

  .board-manager {
    @apply p-4;
  }

</style>
