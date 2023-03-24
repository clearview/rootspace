import api from '@/utils/api'

export enum EmbedType {
  AIRTABLE = 'airtable',
  GOOGLE_SHEETS = 'google-sheets',
  FIGMA = 'figma',
  CUSTOM = 'custom',
}

export interface EmbedResource {
  id: number;
  spaceId: number;
  title: string;
  type: EmbedType;
  content: string;
}

export default class EmbedService {
  static async create (data: Omit<EmbedResource, 'id'>) {
    const res = await api.post('embeds', { data })

    return res.data
  }

  static async view (id: number) {
    const res = await api.get(`embeds/${id}`)

    return res.data
  }

  static async update (data: EmbedResource) {
    const res = await api.patch(`embeds/${data.id}`, { data })

    return res.data
  }

  static async destroy (data: EmbedResource) {
    const res = await api.delete(`embeds/${data.id}`)

    return res.data
  }
}
