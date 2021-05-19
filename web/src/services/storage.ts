import api from '@/utils/api'

import { StorageResource } from '@/types/resource'

export interface SearchParams {
  search: string;
}
export default class StorageService {
  static async fetchItem (id: number, params?: SearchParams) {
    const res = await api.get(`storages/${id}/files`, { params })

    return res.data
  }

  static async create (data: StorageResource) {
    const res = await api.post('storages', { data })

    return res.data
  }

  static async view (id: number) {
    const res = await api.get(`storages/${id}`)

    return res.data
  }

  static async update (id: number, data: StorageResource) {
    const res = await api.patch(`storages/${id}`, { data })

    return res.data
  }

  static async destroy (id: number) {
    const res = await api.delete(`storages/${id}`)

    return res.data
  }
}
