import { Module } from 'vuex'
import { RootState } from '@/types/state'
import EmbedService, { EmbedResource } from '@/services/embed'

export interface EmbedState {
  item: EmbedResource | null;
}

const EmbedModule: Module<EmbedState, RootState> = {
  namespaced: true,

  state () {
    return {
      item: null
    }
  },

  mutations: {
    setItem (state, item) {
      state.item = item
    }
  },

  actions: {
    async view ({ commit }, id: number) {
      const res = await EmbedService.view(id)

      commit('setItem', res.data)
    },

    async create ({ commit }, data: Omit<EmbedResource, 'id'>) {
      commit('setItem', data)

      const res = await EmbedService.create(data)

      commit('setItem', res.data)

      return res
    },

    async update ({ commit }, data: EmbedResource) {
      commit('setItem', data)

      await EmbedService.update(data)

      commit('setItem', data)
    },

    async destroy ({ commit }, data: EmbedResource) {
      await EmbedService.destroy(data)

      commit('setItem', null)
    }
  }
}

export default EmbedModule
