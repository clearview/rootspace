<template>
  <div class="board-manager">
    <div v-if="isKanban" class="board-kanban">
      <Draggable class="board-kanban-draggable" :disabled="!canDrag || !childDragEnable" v-bind="dragOptions" :value="orderedLanes" group="lists" @start="drag=true" @end="drag=false" @change="reorder">
          <TaskLane :can-drag="canDrag" v-for="list in orderedLanes" :list="list" :key="list.id" @drag:enable="childDragEnable = true" @drag:disable="childDragEnable = false"></TaskLane>
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
import { Optional } from '@/types/core'
import { getNextPosition, getReorderIndex, getReorderPosition } from '@/utils/reorder'

@Component({
  name: 'BoardManager',
  components: { TaskAddLane, TaskLane, TaskList, Draggable }
})
export default class BoardManager extends Vue {
    @Prop({ type: Object, required: true })
    private readonly board!: TaskBoardResource;

    @Prop({ type: Boolean, default: true })
    private readonly canDrag!: boolean

    private readonly lists!: TaskListResource[];
    private isInputtingNewList = false
    private newList: Optional<TaskListResource, 'createdAt' | 'updatedAt' | 'userId'> | null = null
    private drag = false
    private childDragEnable = true

    get orderedLanes () {
      return [...this.board.taskLists].sort((a, b) => a.position - b.position)
    }

    get isKanban () {
      return this.board.type === TaskBoardType.Kanban
    }

    get dragOptions () {
      const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1
      return {
        animation: 50,
        delay: 14,
        group: 'lists',
        disabled: false,
        ghostClass: 'ghost',
        forceFallback: !isFirefox,
        fallbackClass: 'lane-floating'
      }
    }

    clearNewList () {
      this.isInputtingNewList = false
      this.newList = null
    }

    addList () {
      this.isInputtingNewList = true
      this.newList = {
        id: null,
        board: this.board,
        boardId: this.board.id,
        description: null,
        position: getNextPosition(this.board.taskLists.length),
        spaceId: this.board.spaceId,
        tasks: [],
        title: '',
        settings: {
          color: 'rgb(247, 248, 250)'
        }
      }
    }

    async reorder (data: MovedEvent<TaskListResource>) {
      if (data.moved) {
        const [prevIndex, nextIndex] = getReorderIndex(data.moved.oldIndex, data.moved.newIndex)
        const prev = this.orderedLanes[prevIndex]
        const next = this.orderedLanes[nextIndex]

        const newPos = getReorderPosition(prev ? prev.position : 0, next ? next.position : getNextPosition(this.board.taskLists.length))

        await this.$store.dispatch('task/list/update', {
          id: data.moved.element.id,
          position: newPos
        })
      }
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

  .lane-floating {
    opacity: 1 !important;
  }
</style>
