import { createChildServiceModule } from '@/store/utils/createChildServiceModule'
import { TagService } from '@/services/task'
import { ResourceState, RootState } from '@/types/state'
import api from '@/utils/api'
import { ActionContext } from 'vuex'
import { TagResource, TaskBoardResource } from '@/types/resource'
import { merge, remove, difference } from 'lodash'

const tag = createChildServiceModule(TagService, (root: RootState) => root.task.board.current?.id, {
  afterCreate (context: ActionContext<ResourceState<TagResource>, RootState>, data: TagResource) {
    if (!context.state.data) {
      context.state.data = []
    }
    context.state.data.push(data)
  },
  afterUpdate (context: ActionContext<ResourceState<TagResource>, RootState>, data: TagResource) {
    context.state.data = context.state.data.map(tag => {
      if (tag.id === data.id) {
        return data
      }
      return tag
    })
  }
})
if (tag.actions) {
  tag.actions.addToTask = async ({ state, commit }, params: { taskId: number; tagId: number }) => {
    commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          const task = list.tasks.find(task => task.id === params.taskId)
          const tag = state.data.find(tag => tag.id === params.tagId)
          if (task && tag) {
            if (!task.tags) {
              task.tags = []
            }
            task.tags.push(tag)
          }
          return list
        })
      }
    }, { root: true })

    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/tag/${params.tagId}/add`)
    commit('setProcessing', false)

    return res
  }
  tag.actions.removeFromTask = async ({ commit }, params: { taskId: number; tagId: number }) => {
    commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          const task = list.tasks.find(task => task.id === params.taskId)
          if (task && task.tags) {
            task.tags = task.tags.filter(t => t.id !== params.tagId)
          }
          return list
        })
      }
    }, { root: true })

    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/tag/${params.tagId}/remove`)
    commit('setProcessing', false)

    return res
  }
  tag.actions.updateTag = async ({ state, commit }, params: { tagId: number; data: object }) => {
    commit('setProcessing', true)
    const res = await api.patch(`tasks/board/tags/${params.tagId}`, { data: params.data })
    commit('setProcessing', false)

    commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks.map(task => {
            if (task.tags) {
              const findIndex = task.tags.findIndex(t => t.id === params.tagId)
              task.tags[findIndex] = merge(task.tags[findIndex], params.data)
            }

            return tag
          })
          return list
        })
      }
      if (state) {
        const findIndex = state.data.findIndex(t => t.id === params.tagId)
        state.data[findIndex] = merge(state.data[findIndex], params.data)
      }
    }, { root: true })
    return res
  }
  tag.actions.deleteTag = async ({ state, commit }, params: { tagId: number }) => {
    commit('setProcessing', true)
    const res = await api.delete(`tasks/board/tags/${params.tagId}`)
    commit('setProcessing', false)

    commit('task/board/operate', (board: ResourceState<TaskBoardResource>) => {
      if (board.current) {
        board.current.taskLists = board.current.taskLists.map(list => {
          list.tasks.map(task => {
            if (task.tags) {
              const findIndex = task.tags.findIndex(t => t.id === params.tagId)
              remove(task.tags, findIndex)
            }

            return tag
          })
          return list
        })
      }
      if (state) {
        const findIndex = state.data.findIndex(t => t.id === params.tagId)
        remove(state.data, findIndex)
      }
    }, { root: true })
    return res
  }
  tag.actions.reorderTags = async ({ state, commit }, params: { data: TagResource[] }) => {
    commit('setProcessing', true)

    // get the difference between the current state and the new state
    const changedTags = difference(params.data, state.data)
    const promises: any[] = []
    changedTags.forEach(async (tag: TagResource) => {
      promises.push(api.patch(`tasks/board/tags/${tag.id}`, { data: tag }))
    })

    // update the differences data
    await Promise.all(promises)

    // update currenr state
    state.data = params.data
    commit('setProcessing', false)
  }
}

export default tag
