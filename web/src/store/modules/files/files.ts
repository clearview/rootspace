import { Module } from 'vuex'

import { RootState, FilesState } from '@/types/state'
import { FilesResource, NewUploadResource } from '@/types/resource'
import api from '@/utils/api'
import FilesService from '@/services/files'

const FilesModule: Module<FilesState, RootState> = {
  namespaced: true,

  state () {
    return {
      item: null,
      processing: false,
      viewAs: 2
    }
  },

  mutations: {
    setItem (state, data) {
      state.item = data
    },
    setViewAs (state, payload: number) {
      state.viewAs = payload
    },
    setProcessing (state, payload: boolean): void {
      state.processing = payload
    }
  },

  actions: {
    async view ({ commit }, id: number) {
      const res = await FilesService.view(id)

      commit('setItem', res.data)
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
    },

    async upload ({ commit, rootGetters }, payload: { item: FilesResource, file: File, config: any }) {
      const activeSpace = rootGetters['space/activeSpace']

      if (!activeSpace) {
        throw new Error('Not in an active space')
      }
      if (!payload.item.id) {
        throw new Error('Invalid files ID')
      }
      const formData = new FormData()
      formData.append('file', payload.file)
      formData.append('entityId', payload.item.id.toString())
      formData.append('type', 'storage')
      formData.append('spaceId', activeSpace.id)
      commit('setProcessing', true)
      const res = await api.post('/uploads', formData, payload.config)
      if (!payload.item.uploads) {
        payload.item.uploads = []
      }
      payload.item.uploads.push(res.data.data)
      commit('setProcessing', false)
      return res
    }
  }
}

export default FilesModule