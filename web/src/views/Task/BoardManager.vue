<template>
  <div class="board-manager">
    <div v-if="isKanban" class="board-kanban">
      <Draggable class="board-kanban-draggable" v-bind="dragOptions" :value="orderedLanes" group="lists" @start="drag=true" @end="drag=false" @change="reorder">
        <transition-group class="board-transition-group" type="transition" :name="!drag ? 'flip-list' : null">
          <TaskLane v-for="list in orderedLanes" :list="list" :key="list.id"></TaskLane>
        </transition-group>
      </Draggable>
      <TaskLane class="lane-input" default-inputting
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
import Draggable, { MovedEvent } from 'vuedraggable'

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
    components: { TaskAddLane, TaskLane, TaskList, Draggable }
  })
export default class BoardManager extends Vue {
    @Prop({ type: Object, required: true })
    private readonly board!: TaskBoardResource;

    private readonly lists!: TaskListResource[];
    private isInputtingNewList = false
    private newList: TaskListResource | null = null
    private drag = false

    get orderedLanes () {
      return [...this.board.taskLists].sort((a, b) => a.position - b.position)
    }

    get isKanban () {
      return this.board.type === TaskBoardType.Kanban
    }

    get dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
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
        position: this.board.taskLists.length,
        spaceId: null,
        tasks: [],
        title: '',
        updatedAt: null,
        userId: null
      }
    }

    async reorder (data: MovedEvent<TaskListResource>) {
      await this.$store.dispatch('task/list/move', {
        parentId: data.moved.element.boardId,
        entryId: data.moved.element.id,
        position: data.moved.newIndex
      })
    }
}
</script>

<style lang="postcss" scoped>

  .flip-list-move {
    transition: transform 0.5s;
  }

  .board-manager {
    @apply h-full;
  }

  .board-list {
    @apply p-4;
  }

  .board-kanban-draggable{
    @apply flex flex-row items-start h-full;
  }
  .board-kanban {
    @apply flex flex-row items-start p-4 overflow-x-scroll h-full;
  }
  .lane-input {
    @apply ml-4;
  }
  .board-transition-group {
    @apply flex flex-row overflow-x-scroll items-start;
  }

</style>
