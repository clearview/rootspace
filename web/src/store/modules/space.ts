import api from '@/utils/api'
import { Module } from 'vuex'

import { RootState, SpaceState } from '@/types/state'
import { SpaceResource, SpaceMetaResource } from '@/types/resource'

type SpaceCollectionPayload = {
  spaces: SpaceResource[];
}

type SpacePayload = {
  index: number;
  space: SpaceResource;
}

type SpaceMetaPayload = {
  index: number;
  meta: SpaceMetaResource;
}

const SpaceModule: Module<SpaceState, RootState> = {
  namespaced: true,

  state () {
    return {
      activeIndex: 0,
      spaces: [],
      spacesMeta: []
    }
  },

  getters: {
    activeSpace (state): SpaceResource {
      const index = state.activeIndex

      return state.spaces[index] || {}
    },
    activeSpaceMeta (state): SpaceMetaResource {
      const index = state.activeIndex

      return state.spacesMeta[index] || {}
    },
    hasSpace (state): boolean {
      return state.spaces.length > 0
    }
  },

  mutations: {
    setActive (state, { space }: SpacePayload) {
      state.activeIndex = state.spaces.findIndex(
        (item) => item.id === space.id
      )
    },

    setSpaces (state, { spaces }: SpaceCollectionPayload) {
      state.spaces = spaces
    },

    addSpace (state, { space }: SpacePayload) {
      state.spaces.push(space)
    },

    updateSpace (state, { index, space }: SpacePayload) {
      const _space = {
        ...state.spaces[index],
        ...space
      }

      state.spaces.splice(index, 1, _space)
    },

    updateMeta (state, { index, meta }: SpaceMetaPayload) {
      const _meta = {
        ...state.spacesMeta[index],
        ...meta
      }

      state.spacesMeta.splice(index, 1, _meta)
    }
  },

  actions: {
    async fetch ({ commit }, params) {
      const res = await api.get('/spaces', { params })

      commit('setSpaces', { spaces: res.data })
    },

    async create ({ commit, state }, space) {
      commit('addSpace', { space })
      commit('setActive', { space })

      const res = await api.post('/spaces', space)

      commit('updateSpace', {
        index: state.activeIndex,
        space: res.data
      })
    },

    async update ({ commit, state }, space) {
      const index = state.spaces.findIndex(
        (item) => item.id === space.id
      )

      commit('updateList', { index, space })

      await api.patch(`/spaces/${space.id}`, space)
    }
  }
}

export default SpaceModule
