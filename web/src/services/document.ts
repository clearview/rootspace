import api from '@/utils/api'

export default class DocumentService {
  static async create (data: object) {
    try {
      const res = await api.post('docs', { data })

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

  static async view (id: string) {
    const { data } = await api.get(`docs/${id}`)

    if (data.status === 'error') {
      throw new Error(data)
    }

    return data
  }

  static async update (id: string, data: object) {
    try {
      const res = await api.patch(`docs/${id}`, { data })

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

  static async destroy (id: number) {
    try {
      const res = await api.delete(`docs/${id}`)
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
}
