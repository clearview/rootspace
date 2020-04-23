import api from '@/utils/api'
import store from '@/store'

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
      const data = error.response.data
      const body = {
        message: data.error.message
      }
      store.commit('error/setError', body)
    }

    throw error
  }
}

export default {
  googleCallback,
  localSignin
}
