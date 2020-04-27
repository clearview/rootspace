import api from '@/utils/api'

async function create (payload: object) {
  try {
    const res = await api.post('spaces', payload)

    return res
  } catch (error) {
    console.log(error)
    let err = error
    if (error.response) {
      const body = {
        code: error.response.status,
        message: error.response.data
      }
      err = body
    }
    console.log(err)
    throw err
  }
}

async function get () {
  const { data } = await api.get('spaces/my')

  if (data.status === 'error') {
    throw new Error(data)
  }

  return data
}

export default {
  create,
  get
}
