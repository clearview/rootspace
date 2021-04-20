import { Module } from 'vuex'

import { RootState, FilesState } from '@/types/state'
import { FilesResource, NewUploadResource } from '@/types/resource'
import api from '@/utils/api'

const FilesItemModule: Module<FilesState, RootState> = {
  namespaced: true,

  mutations: {
    setItem (state, view) {
      state.item = view
    }
  },

  actions: {
    async upload ({ commit, rootGetters }, payload: { item: FilesResource, file: File }) {
      const activeSpace = rootGetters['space/activeSpace']
      
      console.log('activeSpace : ', activeSpace)
      console.log('Payload : ', payload)

      if (!activeSpace) {
        throw new Error('Not in an active space')
      }

      const formData = new FormData()
      formData.append('file', payload.file)
      formData.append('entityId', '1')
      formData.append('type', 'storage')
      formData.append('spaceId', activeSpace.id)
      commit('setProcessing', true)
      const res = await api.post('/uploads', formData)
      // if (!params.task.attachments) {
      //   params.task.attachments = []
      // }
      // params.task.attachments.push(res.data.data)
      commit('setProcessing', false)
      return res
    }
  }
}

export default FilesItemModule
