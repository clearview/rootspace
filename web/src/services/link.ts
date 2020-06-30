import api from '@/utils/api'

import { LinkResource } from '@/types/resource'

export interface FetchParams {
  spaceId: number;
  limit: number;
  offset: number;
  sort: {
    [field: string]: string;
  };
}

export default class LinkService {
  static async fetch ({ spaceId, ...params }: FetchParams) {
    const res = await api.get(`links/${spaceId}`, { params })

    return res.data
  }

  static async create (data: LinkResource) {
    const res = await api.post('links', { data })

    return res.data
  }

  static async view (id: number) {
    const res = await api.get(`links/${id}`)

    return res.data
  }

  static async update (id: number, data: LinkResource) {
    const res = await api.patch(`links/${id}`, { data })

    return res.data
  }

  static async destroy (id: number) {
    const res = await api.delete(`links/${id}`)

    return res.data
  }
}
