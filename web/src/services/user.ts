import api from '@/utils/api'

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

async function update (payload: object) {
  try {
    const res = await api.patch('user/update', payload)

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

async function passwordChange (payload: object) {
  try {
    const res = await api.patch('user/password/change', payload)

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

async function invitation (payload: object) {
  try {
    const res = await api.post('invites/accept', payload)

    return res
  } catch (error) {
    let err = error

    if (error.response) {
      const body = {
        code: error.response.status,
        message: (error.response.status === 401) ? error.response.data : error.response.data.error.message
      }
      err = body
    }

    throw err
  }
}

export default {
  confirmEmail,
  update,
  passwordChange,
  invitation
}
