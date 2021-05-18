import api from '@/utils/api'

import { StorageResource } from '@/types/resource'

export interface FetchParams {
  spaceId: number;
  limit: number;
  offset: number;
  sort: {
    [field: string]: string;
  };
}

export default class StorageService {
  static async fetch ({ spaceId, ...params }: FetchParams) {
    const res = await api.get(`storages/${spaceId}/files`, { params })

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
