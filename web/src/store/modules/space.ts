import api from '@/utils/api'
import { Module } from 'vuex'

import { RootState, SpaceState } from '@/types/state'
import { SpaceResource } from '@/types/resource'

interface UpdateActivePagePayload {
  id: number;
  path: string;
}

const SpaceModule: Module<SpaceState, RootState> = {
  namespaced: true,

  state () {
    return {
      activeIndex: 0,
      list: [],
      activePages: []
    }
  },

  getters: {
    activeSpace (state): SpaceResource {
      const index = state.activeIndex

      return state.list[index] || {}
    },
    activePage (state): string {
      const index = state.activeIndex

      return state.activePages[index] || ''
    },
    isListEmpty (state): boolean {
      return state.list.length < 1
    },
    getIndex: state => (id: number) => (
      state.list.findIndex(x => x.id === id)
    )
  },

  mutations: {
    setActiveIndex (state, activeIndex: number) {
      state.activeIndex = activeIndex
    },

    setList (state, list: SpaceResource[]) {
      state.list = list
    },

    setActivePages (state, activePage: string[]) {
      state.activePages = activePage
    }
  },

  actions: {
    async fetch ({ commit }, params: object) {
      const res = await api.get('/spaces', { params })

      commit('setList', res.data)
    },

    async create ({ commit, state }, space: SpaceResource) {
      const res = await api.post('/spaces', space)

      const list = [
        ...state.list,
        res.data
      ]

      commit('setList', list)

      return res.data
    },

    async update ({ commit, state, getters }, space: SpaceResource) {
      const index = getters.getIndex(space.id)
      const list = [...state.list]

      list[index] = space

      commit('setList', list)

      const res = await api.patch(`/spaces/${space.id}`, space)

      return res.data
    },

    activateSpace ({ commit, state, getters }, id: number) {
      const index = getters.getIndex(id)

      if (state.activeIndex !== index) {
        commit('setActiveIndex', index)
      }
    },

    updateActivePage ({ commit, state, getters }, { id, path }: UpdateActivePagePayload) {
      const index = getters.getIndex(id)
      const pages = state.activePages

      pages[index] = path

      commit('setActivePages', pages)
    },

    async clean ({ commit }) {
      commit('setActiveIndex', 0)
      commit('setSpaces', [])
      commit('setActivePage', [])
    }
  }
}

export default SpaceModule
