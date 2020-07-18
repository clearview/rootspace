import { createServiceModule } from '@/store/utils/createServiceModule'
import { ItemService } from '@/services/task'
import { TaskBoardResource, TaskItemResource, TaskListResource } from '@/types/resource'
import api from '@/utils/api'
import { ResourceState } from '@/types/state'

const item = createServiceModule(ItemService, {
  afterCreate (context, data: TaskItemResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const index = board.current.taskLists.findIndex(list => list.id === data.listId)
        if (index !== -1) {
          const list = board.current.taskLists[index]
          list.tasks.push({
            ...data,
            taskComments: [],
            attachments: [],
            assignees: [],
            tags: []
          })
        }
      }
    }, { root: true })
  },
  afterUpdate (context, data: TaskItemResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const list = board.current.taskLists.find(list => list.id === data.listId)
        if (list) {
          let oldItem: TaskItemResource | null = null
          let oldList: TaskListResource | null = null
          for (const lst of board.current.taskLists) {
            for (const tsk of lst.tasks) {
              if (tsk.id === data.id) {
                oldItem = tsk
                oldList = lst
                break
              }
            }
          }
          if (oldItem && oldList) {
            // Moved to another lane
            if (oldItem.listId !== data.listId) {
              oldList.tasks = oldList.tasks.filter(task => task.id !== data.id)
              const targetList = board.current.taskLists.find(list => list.id === data.listId)
              if (targetList) {
                targetList.tasks.push(data)
              }
            } else {
              list.tasks = list.tasks.map(task => {
                if (task.id === data.id) {
                  return {
                    ...data
                  }
                }
                return task
              })
            }
          }
        }
      }
    }, { root: true })
  },
  afterDestroy (context, data: TaskItemResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const listIndex = board.current.taskLists.findIndex(list => list.id === data.listId)
        if (listIndex !== -1) {
          const list = board.current.taskLists[listIndex]
          list.tasks = list.tasks.filter(task => task.id !== data.id)
        }
      }
    }, { root: true })
  }
})
if (item.actions) {
  item.actions.upload = async ({ dispatch, commit, rootState }, params: { task: TaskItemResource; file: File }) => {
    if (!rootState.auth.currentSpace) {
      throw new Error('Not in an active space')
    }
    if (!params.task.id) {
      throw new Error('Invalid task ID')
    }
    const formData = new FormData()
    formData.append('file', params.file)
    commit('setProcessing', true)
    const res = await api.post(`/upload?spaceId=${rootState.auth.currentSpace.id}`, formData)
    if (!params.task.attachments) {
      params.task.attachments = []
    }
    params.task.attachments.push(res.data)
    await dispatch('update', {
      id: params.task.id,
      attachments: params.task.attachments
    })
    commit('setProcessing', false)

    return res
  }
  item.actions.addAssigneeToTask = async ({ commit }, params: { taskId: number; userId: number }) => {
    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/assignee/${params.userId}/add`)
    commit('setProcessing', false)

    commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks = list.tasks.map(task => {
            if (task.id === params.taskId) {
              return res.data.data
            }
            return task
          })
          return list
        })
      }
    }, { root: true })

    return res
  }
  item.actions.removeAssigneeFromTask = async ({ commit }, params: { taskId: number; userId: number }) => {
    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/assignee/${params.userId}/remove`)
    commit('setProcessing', false)

    commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks = list.tasks.map(task => {
            if (task.id === params.taskId) {
              return res.data.data
            }
            return task
          })
          return list
        })
      }
    }, { root: true })

    return res
  }
}

export default item