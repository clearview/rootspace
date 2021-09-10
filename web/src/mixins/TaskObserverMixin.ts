import { TagResource, TaskBoardResource, TaskItemResource, TaskListResource, UserResource } from '@/types/resource'
import { ResourceState } from '@/types/state'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class TaskObserverMixin extends Vue {
  async createTag (data: any) {
    if (!this.$store.state.task.tag.data) {
      this.$store.state.task.tag.data = []
    }
    this.$store.state.task.tag.data.push(data)
  }

  async updateTag (data: any) {
    this.$store.state.task.tag.data = this.$store.state.task.tag.data.map((tag: TagResource) => {
      if (tag.id === data.id) {
        return data
      }
      return tag
    })
  }

  async archiveTaskLane (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.filter((list: TaskListResource) => list.id !== data.id)
      }
    }, { root: true })
  }

  async createTaskLane (data:any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists.push({ ...data, tasks: [] })
      }
    }, { root: true })
  }

  async updateTaskLane (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const index = board.current.taskLists.findIndex(list => list.id === data.id)
        if (index !== -1) {
          const old = board.current.taskLists[index]
          Vue.set(board.current.taskLists, index, { ...data, tasks: old.tasks })
        }
      }
    }, { root: true })
  }

  async removeTagFromTask (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map((list: TaskListResource) => {
          const task = list.tasks.find((task: TaskItemResource) => task.id === data.taskId)
          if (task && task.tags) {
            task.tags = task.tags.filter((t: TagResource) => t.id !== data.tagId)
          }
          return list
        })
      }
    }, { root: true })
  }

  async addTagToTask (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map((list: TaskListResource) => {
          const task = list.tasks.find((task: TaskItemResource) => task.id === data.taskId)
          const tag = this.$store.state.task.tag.data.find((tag: TagResource) => tag.id === data.tagId)
          if (task && tag) {
            if (!task.tags) {
              task.tags = []
            }

            debugger

            const isExist = task.tags.some((tag: TagResource) => tag.id === data.tagId)
            if (!isExist) {
              task.tags.push(tag)
            }
          }
          return list
        })
      }
    }, { root: true })
  }

  async removeAssignee (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map((list: TaskListResource) => {
          list.tasks = list.tasks.map((task: TaskItemResource) => {
            if (task.id === data.taskId) {
              if (!task.assignees) {
                task.assignees = []
              }
              task.assignees = task.assignees.filter((assignee: UserResource) => assignee.id !== data.userId)
            }
            return task
          })
          return list
        })
      }
    }, { root: true })
  }

  async addAssignee (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map((list: TaskListResource) => {
          list.tasks = list.tasks.map((task: TaskItemResource) => {
            if (task.id === data.taskId) {
              if (!task.assignees) {
                task.assignees = []
              }
              if (data.user) {
                const isExist = task.assignees.some((assignee: UserResource) => assignee.id === data.user.id)
                if (!isExist) {
                  task.assignees.push(data.user)
                }
              }
            }
            return task
          })
          return list
        })
      }
    }, { root: true })
  }

  async restoreTaskItem (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map((list: TaskListResource) => {
          list.tasks = list.tasks.filter((task: TaskItemResource) => {
            return !(task.id === data.taskId && list.id === task.listId)
          })
          return list
        })
      }
    }, { root: true })
  }

  async archiveTaskItem (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map((list: TaskListResource) => {
          list.tasks = list.tasks.filter((task: TaskItemResource) => {
            return !(task.id === data.taskId && list.id === task.listId)
          })
          return list
        })
      }
    }, { root: true })
  }

  async createComment (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map((list: TaskListResource) => {
          list.tasks = list.tasks.map((task: TaskItemResource) => {
            if (task.id === data.taskId) {
              task.taskComments.push(data)
            }
            return task
          })
          return list
        })
      }
    }, { root: true })
  }

  async createTaskItem (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const index = board.current.taskLists.findIndex((list: TaskListResource) => list.id === data.listId)
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
            // check if item id is exist on current list
            const isExist = list.tasks.some((task: TaskItemResource) => task.id === data.id)
            if (!isExist) {
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
      }
    })
  }

  async updateTaskItem (data: any) {
    this.$store.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        const list = board.current.taskLists.find((list: TaskListResource) => list.id === data.listId)
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
              oldList.tasks = oldList.tasks.filter((task: TaskItemResource) => task.id !== data.id)
              const targetList = board.current.taskLists.find((list: TaskListResource) => list.id === data.listId)
              if (targetList) {
                if (!targetList.tasks) {
                  targetList.tasks = [data]
                } else {
                  targetList.tasks.push(data)
                }
              }
            } else {
              list.tasks = list.tasks.map((task: TaskItemResource) => {
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
  }
}
