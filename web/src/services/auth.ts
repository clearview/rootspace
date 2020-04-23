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
    let err = error

    if (error.response) {
      const body = {
        message: error.response.data.error.message
      }
      err = body
    }

    throw err
  }
}

export default {
  googleCallback,
  localSignin
}
