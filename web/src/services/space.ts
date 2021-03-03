import { SpaceRoleResource } from '@/types/resource'
import api from '@/utils/api'

export default class SpaceService {
  static async create (payload: object) {
    try {
      const res = await api.post('spaces', payload)

      return res
    } catch (error) {
      let err = error
      if (error.response) {
        const body = {
          code: error.response.status,
          message: error.response.data
        }
        err = body
      }
      throw err
    }
  }

  static async update (id: number, payload: object) {
    try {
      const res = await api.patch(`spaces/${id}`, payload)

      return res
    } catch (error) {
      let err = error

      if (error.response) {
        const body = {
          code: error.response.status,
          message: (error.response.status === 401) ? error.response.data : error.response.data.error.message,
          fields: error.response.data.error.fields
        }
        err = body
      }

      throw err
    }
  }

  static async my () {
    const { data } = await api.get('spaces/my')

    if (data.status === 'error') {
      throw new Error(data)
    }

    return data
  }

  static async view (id: number) {
    const { data } = await api.get(`spaces/${id}`)

    if (data.status === 'error') {
      throw new Error(data)
    }

    return data
  }

  static async spaceUsers (id: number) {
    if (!id) throw new Error('ID cannot empty')

    const { data } = await api.get(`spaces/${id}/users`)

    if (data.status === 'error') {
      throw new Error(data)
    }

    return data
  }

  static async spaceUsersPending (id: number) {
    const { data } = await api.get(`spaces/${id}/invites`)

    if (data.status === 'error') {
      throw new Error(data)
    }

    return data
  }

  static async removeUser (id: number, userId: number) {
    try {
      const res = await api.delete(`spaces/${id}/users/${userId}`)

      return res
    } catch (error) {
      let err = error

      if (error.response) {
        const body = {
          code: error.response.status,
          message: (error.response.status === 401) ? error.response.data : error.response.data.error.message,
          fields: error.response.data.error.fields
        }
        err = body
      }

      throw err
    }
  }

  static async cancelUser (id: number, inviteId: number) {
    try {
      return await api.delete(`invites/cancel/${inviteId}`)
    } catch (error) {
      let err = error

      if (error.response) {
        const body = {
          code: error.response.status,
          message: (error.response.status === 401) ? error.response.data : error.response.data.error.message,
          fields: error.response.data.error.fields
        }
        err = body
      }

      throw err
    }
  }

  static async whoami (id: number): Promise<SpaceRoleResource> {
    try {
      const res = await api.get(`spaces/${id}/whoami`)

      return res.data.data
    } catch (error) {
      let err = error

      if (error.response) {
        const body = {
          code: error.response.status,
          message: (error.response.status === 401) ? error.response.data : error.response.data.error.message,
          fields: error.response.data.error.fields
        }
        err = body
      }

      throw err
    }
  }
}
