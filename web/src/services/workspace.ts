import api from '@/utils/api'

async function create (payload: object) {
  try {
    const res = await api.post('spaces', payload)

    return res
  } catch (error) {
    if (error.response) {
      throw new Error(error.response)
    }

    throw error
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
