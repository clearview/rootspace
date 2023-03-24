import api from '@/utils/api'

import { NewUploadResource } from '@/types/resource'

export interface FetchParams {
  spaceId: number;
  limit: number;
  offset: number;
  sort: {
    [field: string]: string;
  };
}

export default class UploadService {
  static async create (data: NewUploadResource) {
    const res = await api.post('uploads', { data })

    return res.data
  }

  static async update (id: number, data: NewUploadResource) {
    const res = await api.patch(`uploads/${id}`, { data })

    return res.data
  }

  static async trash (id: number) {
    const res = await api.post(`uploads/${id}/trash`)

    return res.data
  }

  static async delete (id: number) {
    const res = await api.delete(`uploads/${id}`)

    return res.data
  }

  static async restore (id: number) {
    const res = await api.post(`uploads/${id}/restore`)

    return res.data
  }

  static async download (id: number) {
    const res = await api.get(`uploads/${id}/download`, {
      responseType: 'blob'
    })

    return res.data
  }
}
