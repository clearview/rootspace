import api from '@/utils/api'

import { FilesItemResource } from '@/types/resource'

export interface FetchParams {
  spaceId: number;
  limit: number;
  offset: number;
  sort: {
    [field: string]: string;
  };
}

export default class UploadService {
  static async create (data: FilesItemResource) {
    const res = await api.post('uploads', { data })

    return res.data
  }

  static async update (id: number, data: FilesItemResource) {
    const res = await api.patch(`uploads/${id}`, { data })

    return res.data
  }

  static async destroy (id: number) {
    const res = await api.delete(`uploads/${id}`)

    return res.data
  }
}
