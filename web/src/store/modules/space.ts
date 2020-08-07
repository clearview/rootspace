import api from '@/utils/api'
import { Module } from 'vuex'

import { RootState, SpaceState } from '@/types/state'
import { SpaceResource, SpaceMetaResource } from '@/types/resource'

type SpaceCollectionPayload = {
  spaces: SpaceResource[];
}

type SpaceMetaCollectionPayload = {
  spacesMeta: SpaceMetaResource[];
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
      const nextActiveIndex = state.spaces.findIndex(
        (item) => item.id === space.id
      )

      if (nextActiveIndex < 0) {
        state.activeIndex = 0
      } else {
        state.activeIndex = nextActiveIndex
      }
    },

    setSpaces (state, { spaces }: SpaceCollectionPayload) {
      state.spaces = spaces
    },

    setSpacesMeta (state, { spacesMeta }: SpaceMetaCollectionPayload) {
      state.spacesMeta = spacesMeta
    },

    addSpace (state, { space }: SpacePayload) {
      state.spaces.push(space)
    },

    updateSpace (state, { index, space }: SpacePayload) {
      const _space = {
        ...state.spaces[index] || {},
        ...space
      }

      state.spaces.splice(index, 1, _space)
    },

    updateMeta (state, { index, meta }: SpaceMetaPayload) {
      const _meta = {
        ...state.spacesMeta[index] || {},
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

      commit('updateSpace', { index, space })

      await api.patch(`/spaces/${space.id}`, space)
    },

    async clean ({ commit }) {
      commit('setActive', { id: 0 })
      commit('setSpaces', { spaces: [] })
      commit('setSpacesMeta', { spacesMeta: [] })
    }
  }
}

export default SpaceModule
