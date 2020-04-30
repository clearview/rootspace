import { Module } from 'vuex'

import { RootState, LinkState } from '@/types/state'
import { LinkResource } from '@/types/resource'

import LinkService from '@/services/link'

import { treeTransform } from '../helpers/treeTransform'

const LinkModule: Module<LinkState, RootState> = {
  namespaced: true,

  state () {
    return {
      active: null,
      payload: []
    }
  },

  getters: {
    tree (state) {
      return state.payload.map(treeTransform)
    }
  },

  mutations: {
    setActive (state, link) {
      state.active = link
    },
    setPayload (state, payload) {
      state.payload = payload
    },
    pushPayload (state, link) {
      state.payload = [
        ...state.payload,
        link
      ]
    },
    removePayload (state, link) {
      state.payload = state.payload.filter(item => item.id !== link.id)
    }
  },

  actions: {
    async fetch ({ commit }, params) {
      const res = await LinkService.fetch(params)

      commit('setPayload', res)
    },

    async create ({ commit }, data: LinkResource) {
      const res = await LinkService.create(data)

      commit('pushPayload', res)
    },

    async update (_, data: LinkResource) {
      await LinkService.update(data.id, data)
    },

    async destroy ({ commit }, data: LinkResource) {
      if (!data.id) {
        throw new Error('ID is not defined')
      }

      await LinkService.destroy(data.id)

      commit('removePayload', data)
    }
  }
}

export default LinkModule
