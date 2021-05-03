import api from '@/utils/api'

import { NodeResource, UserResource } from '@/types/resource'

export interface FetchParams {
  spaceId: number;
  limit: number;
  offset: number;
  sort: {
    [field: string]: string;
  };
}

interface Response {
  data: Array<NodeResource>;
}

export default class TreeService {
  static async fetchBySpace (spaceId: number, params?: FetchParams): Promise<Response> {
    const res = await api.get(`spaces/${spaceId}/tree`, { params })

    return res.data
  }

  static async fetchFavoritesBySpace (spaceId: number): Promise<Response> {
    const res = await api.get(`spaces/${spaceId}/favorites`)

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

  static async clearArchive (spaceId: number) {
    const res = await api.delete(`spaces/${spaceId}/archive`)

    return res.data
  }

  static async archive (id: number) {
    const res = await api.post(`nodes/${id}/archive`)

    return res.data
  }

  static async addToFavorites (id: number) {
    const res = await api.post(`nodes/${id}/favorites`)

    return res.data
  }

  static async removeFromFavorites (id: number) {
    const res = await api.delete(`nodes/${id}/favorites`)

    return res.data
  }

  static async restore (id: number) {
    const res = await api.post(`nodes/${id}/restore`)

    return res.data
  }

  static async createFolder (data: NodeResource) {
    const res = await api.post('folders', { data })

    return res.data
  }

  static async filterUnauthorizedDoc (list: Array<NodeResource>, user: UserResource | null) {
    const newList = []
    for (let i = 0; i < list.length; i++) {
      const item = { ...list[i] }
      if (item.children) {
        item.children = await this.filterUnauthorizedDoc(item.children, user)
      }

      if (item.type === 'doc' && user) {
        const res = await api.get(`content/access/Doc/${item.contentId}`)
        item.contentAccess = res.data.data

        console.log(user)

        const hasAccess = item.contentAccess?.type === 'open' || item.contentAccess?.type === 'restricted' || item.contentAccess?.public || item.contentAccess?.ownerId === user.id

        if (hasAccess) {
          newList.push(item)
        }
      } else {
        newList.push(item)
      }
    }

    return newList
  }

  static hideDocs (list: Array<NodeResource>): Array<NodeResource> {
    const newList = []
    for (let i = 0; i < list.length; i++) {
      const item = { ...list[i] }

      if (item.children) {
        item.children = this.hideDocs(item.children)
      }

      if (item.type !== 'doc') {
        newList.push(item)
      }
    }

    return newList
  }
}
