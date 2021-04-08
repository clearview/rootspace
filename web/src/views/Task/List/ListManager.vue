<template>
  <list-ghost v-if="loading" active/>
  <div v-else class="list-manager">
    <div class="empty" v-if="orderedLanes.length === 0 && !isInputtingNewList">
      You don't have any lists, start by making one.
      <div class="add-empty">
        <ListAddLaneButton @click="addList">
          Add List
        </ListAddLaneButton>
      </div>
    </div>
    <Draggable handle=".drag" class="list-lane-draggable" :disabled="!canDrag || !childDragEnable" v-bind="dragOptions" :value="orderedLanes" group="lists" @start="drag=true" @end="drag=false" @change="reorder">
      <ListLane :can-drag="canDrag" v-for="list in orderedLanes" :list="list" :key="list.id" @drag:enable="childDragEnable = true" @drag:disable="childDragEnable = false"></ListLane>
    </Draggable>
    <ListLane class="lane-input" default-inputting
              v-if="isInputtingNewList"
              :list="newList"
              @save="clearNewList"
              @cancel="clearNewList"/>
    <div class="add-another-list">
    <ListAddLaneButton @click="addList" v-if="childDragEnable && orderedLanes.length !== 0">
      Add List
    </ListAddLaneButton>
    </div>
  </div>
</template>

<script lang="ts">
import Draggable from 'vuedraggable'

import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskBoardResource, TaskListResource } from '@/types/resource'
import { Optional } from '@/types/core'
import { getNextPosition, getReorderIndex, getReorderPosition } from '@/utils/reorder'
import ListLane from '@/views/Task/List/ListLane.vue'
import TaskAddLane from '@/views/Task/Kanban/TaskAddLane.vue'
import ListAddLaneButton from '@/views/Task/List/ListAddLaneButton.vue'
import ListGhost from './ListGhost.vue'

@Component({
  name: 'ListManager',
  components: { ListAddLaneButton, TaskAddLane, ListLane, ListGhost, Draggable }
})
export default class ListManager extends Vue {
    @Prop({ type: Object })
    private readonly board!: TaskBoardResource;

    @Prop({ type: Boolean, default: true })
    private readonly canDrag!: boolean

    @Prop({ type: Boolean })
    private readonly loading!: boolean

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
        fallbackOnBody: true,
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
      }
    }
}
</script>

<style lang="postcss" scoped>

  .flip-list-move {
    transition: transform 0.5s;
  }

  .list-manager {
    /* padding: 40px 20px; */
  }

  .list-lane-draggable {
    margin-bottom: 38px;
  }
  .empty {
    font-size: 16px;
    color: theme("colors.gray.800");
    margin-left: 20px;
    padding-top: 8px;
  }
  .add-empty {
    margin-top: 16px;
  }

  .lane-input {

  }

  .lane-floating {
    opacity: 1 !important;
  }

  .add-another-list {
    margin-top: 36px;
    margin-left: 20px;
  }
</style>
