import api from '@/utils/api'

async function googleCallback (params: object) {
  const { data } = await api.get('auth/google/callback', { params })

  if (data.status === 'error') {
    throw new Error(data.msg)
  }

  return data
}

async function localSignin (payload: object) {
  try {
    const res = await api.post('auth', payload)

    return res
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.body.msg)
    }

    throw error
  }
}

export default {
  googleCallback,
  localSignin
}
