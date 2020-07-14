import api from '@/utils/api'
import { Module } from 'vuex'

import { RootState, SpaceState } from '@/types/state'
import { SpaceResource, SpaceMetaResource } from '@/types/resource'

const SpaceModule: Module<SpaceState, RootState> = {
  namespaced: true,

  state () {
    return {
      activeIndex: 0,
      list: [],
      meta: []
    }
  },

  getters: {
    activeSpace (state): SpaceResource & SpaceMetaResource {
      const index = state.activeIndex

      return {
        ...state.list[index] || {},
        ...state.meta[index] || {}
      }
    }
  },

  mutations: {
    setActive (state, space: SpaceResource) {
      state.activeIndex = state.list.findIndex(
        (item) => item.id === space.id
      )
    },

    setList (state, list: SpaceResource[]) {
      state.list = list
    },

    pushList (state, space) {
      state.list.push(space)
    },

    patchList (state, { index, space }) {
      state.list.splice(index, 1, space)
    },

    setActivetList (state, space: SpaceResource) {
      const index = state.activeIndex

      state.list.splice(index, 1, space)
    },

    setActiveMeta (state, meta: SpaceMetaResource) {
      const index = state.activeIndex

      state.meta.splice(index, 1, meta)
    }
  },

  actions: {
    async fetch ({ commit }, params) {
      const res = await api.get('/spaces', { params })

      commit('setList', res.data)
    },

    async create ({ commit, state }, space) {
      commit('pushList', space)
      commit('setActive', space)

      const res = await api.post('/spaces', space)

      commit('patchList', {
        index: state.activeIndex,
        space: res.data
      })
    },

    async update ({ commit, state }, space) {
      const index = state.list.findIndex(
        (item) => item.id === space.id
      )

      commit('patchList', { index, space })

      await api.patch(`/spaces/${space.id}`, space)
    }
  }
}

export default SpaceModule
