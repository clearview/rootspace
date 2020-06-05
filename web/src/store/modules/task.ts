import { Module } from 'vuex'

import { RootState, TaskState } from '@/types/state'
import { TaskResource } from '@/types/resource'

import TaskService from '@/services/task'

const TaskModule: Module<TaskState, RootState> = {
  namespaced: true,

  state () {
    return {
      payload: [],
      folded: {},
      active: null,
      current: null
    }
  },

  mutations: {
    setPayload (state, payload) {
      state.payload = payload
    },
    setActive (state, task) {
      state.active = task
    },
    setCurrent (state, task) {
      state.current = task
    },
    setFolded (state, path) {
      state.folded = {
        ...state.folded,
        ...path
      }
    }
  },

  actions: {
    async fetch ({ commit, rootState }, params) {
      const currentSpace = rootState.auth.currentSpace

      if (!currentSpace) {
        throw new Error('There is no currently active space')
      }

      const res = await TaskService.fetch({
        ...params,
        spaceId: currentSpace.id
      })

      commit('setPayload', res)
    },

    async view ({ commit }, id: number) {
      const task = await TaskService.view(id)
      commit('setCurrent', task)
    },

    async create ({ dispatch }, data: TaskResource) {
      await TaskService.create(data)
      await dispatch('fetch')
    },

    async update ({ dispatch }, data: TaskResource) {
      await TaskService.update(data.id, data)
      await dispatch('fetch')
    },

    async destroy ({ dispatch }, data: TaskResource) {
      if (!data.id) {
        throw new Error('ID is not defined')
      }

      await TaskService.destroy(data.id)
      await dispatch('fetch')
    }
  }
}

export default TaskModule
