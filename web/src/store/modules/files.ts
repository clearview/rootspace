import { Module } from 'vuex'

import { RootState, FilesState } from '@/types/state'
import { FilesResource } from '@/types/resource'

import FilesService from '@/services/files'

const FilesModule: Module<FilesState, RootState> = {
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
      const { data } = await FilesService.view(id)

      commit('setItem', data)
    },

    async create (_, data: FilesResource) {
      return await FilesService.create(data)
    },

    async update (_, data: FilesResource) {
      await FilesService.update(data.id, data)
    },

    async destroy (_, data: FilesResource) {
      if (!data.id) {
        throw new Error('ID is not defined')
      }

      await FilesService.destroy(data.id)
    }
  }
}

export default FilesModule
