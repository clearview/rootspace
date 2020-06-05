import api from '@/utils/api'
import store from '@/store'

async function create (data: object) {
  try {
    const res = await api.post('docs', { data })
    await store.dispatch('link/fetch')

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

async function view (id: string) {
  const { data } = await api.get(`docs/${id}`)

  if (data.status === 'error') {
    throw new Error(data)
  }

  return data
}

async function update (id: string, data: object) {
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

export default {
  create,
  view,
  update
}
