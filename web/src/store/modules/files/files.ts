import { Module } from 'vuex'

import { RootState, FilesState } from '@/types/state'
import { FilesResource, FilesItemResource, NewUploadResource } from '@/types/resource'
import api from '@/utils/api'
import FilesService from '@/services/files'
import UploadService from '@/services/upload'

const FilesModule: Module<FilesState, RootState> = {
  namespaced: true,

  state () {
    return {
      item: null,
      processing: false,
      viewAs: 0
    }
  },

  mutations: {
    setItem (state, data) {
      state.item = data
    },
    setViewAs (state, payload: number) {
      console.log(payload)
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

    async update (_, payload: { id: number, data: FilesItemResource }) {
      return await UploadService.update(payload.id, payload.data)
    },

    async destroy (_, id: FilesItemResource) {
      if (!id) {
        throw new Error('ID is not defined')
      }

      return await UploadService.destroy(id)
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
