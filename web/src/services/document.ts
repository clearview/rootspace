import api from '@/utils/api'
import store from '@/store'

async function create (payload: object) {
  try {
    const { data } = await api.post('docs', { data: payload })
    await store.dispatch('link/fetch')

    return data
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

async function view (id: number | string) {
  const { data } = await api.get(`docs/${id}`)

  if (data.status === 'error') {
    throw new Error(data)
  }

  return data
}

async function update (id: number| string, payload: object) {
  try {
    const { data } = await api.patch(`docs/${id}`, { data: payload })

    return data
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

export default {
  create,
  view,
  update
}
