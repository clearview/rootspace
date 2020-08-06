import { createServiceModule } from '@/store/utils/createServiceModule'
import { ItemService } from '@/services/task'
import { TaskBoardResource, TaskItemResource, TaskListResource, UserResource } from '@/types/resource'
import api from '@/utils/api'
import { ResourceState, RootState } from '@/types/state'
import { ActionContext } from 'vuex'

const item = createServiceModule(ItemService, {
  afterCreate (context, data: TaskItemResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const index = board.current.taskLists.findIndex(list => list.id === data.listId)
        if (index !== -1) {
          const list = board.current.taskLists[index]
          if (!list.tasks) {
            list.tasks = [{
              ...data,
              taskComments: [],
              attachments: [],
              assignees: [],
              tags: []
            }]
          } else {
            list.tasks.push({
              ...data,
              taskComments: [],
              attachments: [],
              assignees: [],
              tags: []
            })
          }
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
                if (!targetList.tasks) {
                  targetList.tasks = [data]
                } else {
                  targetList.tasks.push(data)
                }
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
  beforeUpdate (context: ActionContext<ResourceState<TaskItemResource>, RootState>, data: TaskItemResource) {
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
                if (!targetList.tasks) {
                  targetList.tasks = [{ ...oldItem, listId: data.listId, position: data.position }]
                } else {
                  targetList.tasks.push({ ...oldItem, listId: data.listId, position: data.position })
                }
              }
            } else {
              list.tasks = list.tasks.map(task => {
                if (task.id === data.id) {
                  return { ...oldItem, listId: data.listId, position: data.position } as TaskItemResource
                }
                return task
              })
            }
          }
        } else if (data.dueDate) {
          board.current.taskLists = board.current.taskLists.map(list => {
            const task = list.tasks.find(task => task.id === data.id)
            if (task) {
              task.dueDate = data.dueDate
            }
            return list
          })
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
  item.actions.upload = async ({ dispatch, commit, rootGetters }, params: { task: TaskItemResource; file: File }) => {
    const activeSpace = rootGetters['space/activeSpace']

    if (!activeSpace) {
      throw new Error('Not in an active space')
    }
    if (!params.task.id) {
      throw new Error('Invalid task ID')
    }
    const formData = new FormData()
    formData.append('file', params.file)
    commit('setProcessing', true)
    const res = await api.post(`/upload?spaceId=${activeSpace.id}`, formData)
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
  item.actions.addAssigneeToTask = async ({ commit }, params: { taskId: number; userId: number; user?: UserResource }) => {
    commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks = list.tasks.map(task => {
            if (task.id === params.taskId) {
              if (!task.assignees) {
                task.assignees = []
              }
              if (params.user) {
                task.assignees.push(params.user)
              }
            }
            return task
          })
          return list
        })
      }
    }, { root: true })

    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/assignee/${params.userId}/add`)
    commit('setProcessing', false)

    return res
  }
  item.actions.removeAssigneeFromTask = async ({ commit }, params: { taskId: number; userId: number }) => {
    commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks = list.tasks.map(task => {
            if (task.id === params.taskId) {
              if (!task.assignees) {
                task.assignees = []
              }
              task.assignees = task.assignees.filter(t => t.id !== params.userId)
            }
            return task
          })
          return list
        })
      }
    }, { root: true })

    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/assignee/${params.userId}/remove`)
    commit('setProcessing', false)

    return res
  }
}

export default item
