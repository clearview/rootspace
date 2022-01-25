<template>
  <task-ghost
    v-if="loading"
    active
  />
  <div
    v-else
    class="board-manager"
    id="board-manager"
  >
    <div
      v-if="isKanban"
      class="board-kanban"
    >
      <Draggable
        v-if="orderedLanes.length"
        class="board-kanban-draggable"
        :disabled="!canDrag || !childDragEnable"
        v-bind="dragOptions"
        :value="orderedLanes"
        group="lists"
        @start="drag=true"
        @end="drag=false"
        @change="reorder"
      >
        <TaskLane
          :can-drag="canDrag"
          v-for="list in orderedLanes"
          :list="list"
          :key="list.id"
          @drag:enable="childDragEnable = true"
          @drag:disable="childDragEnable = false"
          :isArchived="!canDrag"
        ></TaskLane>
      </Draggable>

      <TaskLane
        v-if="isInputtingNewList"
        class="lane-input"
        default-inputting
        :list="newList"
        @save="clearNewList"
        @cancel="clearNewList"
        :isArchived="!canDrag"
      />
      <TaskAddLane
        v-else-if="!archivedView"
        @click="addList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Draggable from 'vuedraggable'

import { Component, InjectReactive, Prop, Vue } from 'vue-property-decorator'
import { TaskBoardResource, TaskListResource, UserResource } from '@/types/resource'
import { Optional } from '@/types/core'
import { getNextPosition, getReorderIndex, getReorderPosition } from '@/utils/reorder'
import TaskLane from './TaskLane.vue'
import TaskAddLane from './TaskAddLane.vue'
import TaskGhost from './TaskGhost.vue'
import { ArchivedViewKey, ClientID, TaskId, YDoc } from '../injectionKeys'
import * as Y from 'yjs'

@Component({
  name: 'BoardManager',
  components: { TaskAddLane, TaskLane, TaskGhost, Draggable }
})
export default class BoardManager extends Vue {
  @Prop({ type: Object })
  private readonly board!: TaskBoardResource;

  @Prop({ type: Boolean, default: true })
  private readonly canDrag!: boolean

  @Prop({ type: Boolean })
  private readonly loading!: boolean

  @InjectReactive(ArchivedViewKey)
  private archivedView!: boolean

  @InjectReactive(YDoc)
  private readonly doc!: Y.Map<any>

  @InjectReactive(TaskId)
  private readonly taskId!: string

  @InjectReactive(ClientID)
  private readonly clientId!: Number

  @InjectReactive()
  private readonly user!: UserResource

  private readonly lists!: TaskListResource[];
  private isInputtingNewList = false
  private newList: Optional<TaskListResource, 'createdAt' | 'updatedAt' | 'userId'> | null = null
  private drag = false
  private childDragEnable = true

  get orderedLanes () {
    return [...this.board.taskLists].sort((a, b) => a.position - b.position)
  }

  get isKanban (): boolean {
    return this.$route.name === 'TaskPage' || this.$route.name === 'TaskPageWithItem'
  }

  get dragOptions () {
    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1
    return {
      delay: 14,
      group: 'lists',
      disabled: false,
      ghostClass: 'ghost',
      forceFallback: !isFirefox,
      fallbackClass: 'lane-floating',
      fallbackOnBody: true
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
      position: getNextPosition(this.board.taskLists.length, this.orderedLanes && this.orderedLanes.length > 0 ? this.orderedLanes[this.orderedLanes.length - 1].position : 0),
      spaceId: this.board.spaceId,
      tasks: [],
      title: '',
      settings: {
        color: 'rgb(247, 248, 250)'
      }
    }
  }

  async reorder (data: any) {
    if (data.moved) {
      const [prevIndex, nextIndex] = getReorderIndex(data.moved.oldIndex, data.moved.newIndex)
      const prev = this.orderedLanes[prevIndex]
      const next = this.orderedLanes[nextIndex]

      const newPos = getReorderPosition(prev ? prev.position : 0, next ? next.position : getNextPosition(this.board.taskLists.length, prev.position))

      await this.$store.dispatch('task/list/update', {
        id: data.moved.element.id,
        position: newPos
      })

      this.doc.doc.transact(() => {
        this.doc.set(this.taskId, {
          clientId: this.clientId,
          action: 'taskLaneMoved',
          id: data.moved.element.id,
          position: newPos
        })
      }, this.clientId)
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
  /* @apply p-4; */
}

.board-kanban-draggable {
  @apply flex flex-row items-start h-full;
}
.board-kanban {
  @apply flex flex-row items-start h-full;
}
.lane-input {
  @apply ml-4;

  &:first-child {
    margin-left: 0;
  }
}
.board-transition-group {
  @apply flex flex-row items-start;
}

.lane-floating {
  opacity: 1 !important;
}
</style>
