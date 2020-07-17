import { createServiceModule } from '@/store/utils/createServiceModule'
import { CommentService } from '@/services/task'
import { ActionContext } from 'vuex'
import { TaskBoardResource, TaskCommentResource } from '@/types/resource'
import { ResourceState, RootState } from '@/types/state'

export default createServiceModule(CommentService, {
  afterCreate (context: ActionContext<ResourceState<TaskCommentResource>, RootState>, data: TaskCommentResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks = list.tasks.map(task => {
            if (task.id === data.taskId) {
              task.taskComments.push(data)
            }
            return task
          })
          return list
        })
      }
    }, { root: true })
  },
  afterUpdate (context: ActionContext<ResourceState<TaskCommentResource>, RootState>, data: TaskCommentResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks = list.tasks.map(task => {
            if (task.id === data.taskId) {
              task.taskComments = task.taskComments.map(comment => {
                if (comment.id === data.id) {
                  console.log(data)
                  return data
                }
                return comment
              })
            }
            return task
          })
          return list
        })
      }
    }, { root: true })
  },
  afterDestroy (context: ActionContext<ResourceState<TaskCommentResource>, RootState>, data: TaskCommentResource) {
    context.commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks = list.tasks.map(task => {
            if (task.id === data.taskId) {
              task.taskComments = task.taskComments.filter(comment => comment.id !== data.id)
            }
            return task
          })
          return list
        })
      }
    }, { root: true })
  }
})
