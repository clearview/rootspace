import { Module } from 'vuex'

import { RootState, LinkState } from '@/types/state'
import { LinkResource } from '@/types/resource'

import LinkService from '@/services/link'

const LinkModule: Module<LinkState, RootState> = {
  namespaced: true,

  state () {
    return {
      item: null
    }
  },

  mutations: {
    setItem (state, view) {
      state.item = view
    }
  },

  actions: {
    async view ({ commit }, id: number) {
      const { data } = await LinkService.view(id)

      commit('setItem', data)
    },

    async create (_, data: LinkResource) {
      return await LinkService.create(data)
    },

    async update (_, data: LinkResource) {
      await LinkService.update(data.id, data)
    },

    async destroy (_, data: LinkResource) {
      if (!data.id) {
        throw new Error('ID is not defined')
      }

      await LinkService.destroy(data.id)
    }
  }
}

export default LinkModule
