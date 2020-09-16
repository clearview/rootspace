import api from '@/utils/api'
import { ValidationError } from '@/utils/error'

async function confirmEmail (payload: object) {
  try {
    const res = await api.patch('users/confirm/email', payload)

    return res
  } catch (err) {
    const { response } = err

    if (response) {
      const { message, fields } = response.data.error

      throw new ValidationError(message, fields)
    } else {
      throw err
    }
  }
}

async function update (data: object) {
  try {
    const res = await api.patch('users', { data })

    return res.data
  } catch (err) {
    const { response } = err

    if (response) {
      const { message, fields } = response.data.error

      throw new ValidationError(message, fields)
    } else {
      throw err
    }
  }
}

async function passwordChange (data: object) {
  try {
    const res = await api.patch('users/password', { data })

    return res
  } catch (err) {
    const { response } = err

    if (response) {
      const { message, fields } = response.data.error

      throw new ValidationError(message, fields)
    } else {
      throw err
    }
  }
}

async function acceptInvitation (data: object) {
  try {
    const res = await api.post('invites/accept', { data })

    return res.data
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

async function addInvitation (data: object) {
  try {
    const res = await api.post('invites/create', { data })

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

export default {
  confirmEmail,
  update,
  passwordChange,
  acceptInvitation,
  addInvitation
}
