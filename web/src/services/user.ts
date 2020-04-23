import api from '@/utils/api'

async function signup (payload: object) {
  try {
    const res = await api.post('signup', payload)

    return res
  } catch (error) {
    let err = error

    if (error.response) {
      const body = {
        message: error.response.data.error.message,
        fields: error.response.data.error.fields
      }
      err = body
    }

    throw err
  }
}

async function confirmEmail (payload: object) {
  try {
    const res = await api.patch('user/confirm/email', payload)

    return res
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.body.msg)
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
