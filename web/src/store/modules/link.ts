import { Module } from 'vuex'

import { RootState, LinkState } from '@/types/state'
import { LinkResource } from '@/types/resource'

import LinkService from '@/services/link'

const LinkModule: Module<LinkState, RootState> = {
  namespaced: true,

  state () {
    return {
      active: null,
      payload: []
    }
  },

  mutations: {
    setActive (state, link) {
      state.active = link
    },
    setPayload (state, payload) {
      state.payload = payload
    },
    addLink (state, link) {
      state.payload = [
        ...state.payload,
        link
      ]
    },
    updateLink (state, link) {
      state.payload = state.payload.map(
        item => (
          item.id === link.id
            ? link
            : item
        )
      )
    },
    removeLink (state, link) {
      state.payload = state.payload.filter(
        item => item.id !== link.id
      )
    }
  },

  actions: {
    async fetch ({ commit }, params) {
      const res = await LinkService.fetch(params)

      commit('setPayload', res)
    },

    async create ({ commit }, data: LinkResource) {
      const res = await LinkService.create(data)

      commit('addLink', res)
    },

    async update ({ commit }, data: LinkResource) {
      const res = await LinkService.update(data.id, data)

      commit('updateLink', res)
    },

    async destroy ({ commit }, data: LinkResource) {
      if (!data.id) {
        throw new Error('ID is not defined')
      }

      await LinkService.destroy(data.id)

      commit('removeLink', data)
    }
  }
}

export default LinkModule
