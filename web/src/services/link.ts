import api from '@/utils/api'

import { LinkResource } from '@/types/resource'

export interface FetchParams {
  limit: number;
  offset: number;
  filter: {
    [field: string]: string;
  };
  sort: {
    [field: string]: string;
  };
}

export default class LinkService {
  static async fetch (id: number, params: FetchParams) {
    const res = await api.get(`links/${id}`, { params })

    return res.data
  }

  static async create (body: LinkResource) {
    const res = await api.post('links', { data: body })

    return res.data
  }

  static async view (id: number) {
    const res = await api.get(`links/view/${id}`)

    return res.data
  }

  static async update (id: number, body: LinkResource) {
    const res = await api.patch(`links/${id}`, { data: body })

    return res.data
  }

  static async destroy (id: number) {
    const res = await api.delete(`links/${id}`)

    return res.data
  }
}
