import api from '@/utils/api'

async function create (payload: object) {
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

async function update (id: number, payload: object) {
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

async function my () {
  const { data } = await api.get('spaces/my')

  if (data.status === 'error') {
    throw new Error(data)
  }

  return data
}

async function view (id: number) {
  const { data } = await api.get(`spaces/${id}`)

  if (data.status === 'error') {
    throw new Error(data)
  }

  return data
}

async function userAtSpace (id: number) {
  const { data } = await api.get(`spaces/${id}/users`)

  if (data.status === 'error') {
    throw new Error(data)
  }

  return data
}

async function removeUser (id: number, userId: number) {
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

export default {
  create,
  update,
  my,
  view,
  userAtSpace,
  removeUser
}
