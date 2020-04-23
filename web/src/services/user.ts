import api from '@/utils/api'
import store from '@/store'

async function signup (payload: object) {
  try {
    const res = await api.post('signup', payload)

    return res
  } catch (error) {
    if (error.response) {
      const data = error.response.data
      const body = {
        message: data.error.message,
        fields: data.error.fields
      }
      store.commit('error/setError', body)
    }

    throw error
  }
}

async function confirmEmail (payload: object) {
  try {
    const res = await api.patch('user/confirm/email', payload)

    return res
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.body.msg)
      // const data = error.response.data
      // const body = {
      //   message: data.error.message
      // }
      // store.commit('error/setError', body)
    }

    throw error
  }
}

async function whoami () {
  const { data } = await api.get('whoami')

  if (data.status === 'error') {
    throw new Error(data.msg)
  }

  return data
}

export default {
  signup,
  confirmEmail,
  whoami
}
