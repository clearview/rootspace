import { createServiceModule } from '@/store/utils/createServiceModule'
import { ListService } from '@/services/task'
import { TaskBoardResource, TaskListResource } from '@/types/resource'
import { ResourceState } from '@/types/state'
import Vue from 'vue'

const list = createServiceModule(ListService, {
  afterCreate (context, data: TaskListResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists.push({ ...data, tasks: [] })
      }
    }, { root: true })
  },
  afterUpdate (context, data: TaskListResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const index = board.current.taskLists.findIndex(list => list.id === data.id)
        if (index !== -1) {
          const old = board.current.taskLists[index]
          Vue.set(board.current.taskLists, index, { ...data, tasks: old.tasks })
        }
      }
    }, { root: true })
  },
  beforeUpdate (context, data: TaskListResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const index = board.current.taskLists.findIndex(list => list.id === data.id)
        if (index !== -1) {
          const old = board.current.taskLists[index]
          Vue.set(board.current.taskLists, index, { ...old, position: data.position })
        }
      }
    }, { root: true })
  },
  afterDestroy (context, data: TaskListResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.filter(list => list.id !== data.id)
      }
    }, { root: true })
  }
})
export default list
