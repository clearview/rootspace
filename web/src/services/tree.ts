import api from '@/utils/api'

import { NodeResource } from '@/types/resource'

export interface FetchParams {
  spaceId: number;
  limit: number;
  offset: number;
  sort: {
    [field: string]: string;
  };
}

interface Response {
  data: NodeResource;
}

export default class TreeService {
  static async fetchBySpace (spaceId: number, params?: FetchParams): Promise<Response> {
    const res = await api.get(`spaces/${spaceId}/tree`, { params })

    return res.data
  }

  static async update (id: number, data: NodeResource) {
    const res = await api.patch(`nodes/${id}`, { data })

    return res.data
  }

  static async destroy (id: number) {
    const res = await api.delete(`nodes/${id}`)

    return res.data
  }

  static async createFolder (data: NodeResource) {
    const res = await api.post('folders', { data })

    return res.data
  }
}
