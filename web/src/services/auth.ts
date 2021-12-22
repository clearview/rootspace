import api from '@/utils/api'
import { ValidationError } from '@/utils/error'

export default class AuthService {
  static async whoami () {
    try {
      const res = await api.get('whoami')

      if (!res.data) {
        throw new Error('Invalid response from server')
      }

      if (res.data.status === 'error') {
        throw new Error(res.data.msg)
      }

      return res
    } catch (err) {
      const { response } = err

      if (response) {
        const { message } = response.data.error

        throw new Error(message)
      } else {
        throw err
      }
    }
  }

  static async signup (payload: object) {
    try {
      const res = await api.post('signup', payload)

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

  static async signin (type: string, payload: object) {
    switch (type) {
      case 'google':
        return AuthService.signinGoogle(payload)

      case 'email':
        return AuthService.signinEmail(payload)

      default:
        throw new Error('Sign-in type is not available')
    }
  }

  static async signinGoogle (params: object) {
    try {
      const res = await api.get('auth/google/callback', { params })

      if (!res.data) {
        throw new Error('Invalid response from server')
      }

      if (res.data.status === 'error') {
        throw new Error(res.data.msg)
      }

      return res
    } catch (err) {
      const { response } = err

      if (response) {
        throw new Error(response.data.error.message)
      } else {
        throw err
      }
    }
  }

  static async signinEmail (payload: object) {
    try {
      const res = await api.post('auth', payload)

      if (!res.data) {
        throw new Error('Invalid response from server')
      }

      if (res.data.status === 'error') {
        throw new Error(res.data.msg)
      }

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

  static async recoverPassword (payload: object) {
    try {
      const res = await api.post('users/password/recovery', payload)

      if (!res.data) {
        throw new Error('Invalid response from server')
      }

      if (res.data.status === 'error') {
        throw new Error(res.data.msg)
      }

      return res
    } catch (err) {
      const { response } = err

      if (response) {
        throw new Error(response.data.error.message)
      } else {
        throw err
      }
    }
  }

  static async passwordReset (payload: object) {
    try {
      const res = await api.post('users/password/reset', payload)

      if (!res.data) {
        throw new Error('Invalid response from server')
      }

      if (res.data.status === 'error') {
        throw new Error(res.data.msg)
      }

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

  static async passwordResetVerify (token: string) {
    try {
      const res = await api.get(`password/reset/verify/${token}`)

      if (!res.data) {
        throw new Error('Invalid response from server')
      }

      if (res.data.status === 'error') {
        throw new Error(res.data.msg)
      }

      return res
    } catch (err) {
      const { response } = err

      if (response) {
        throw new Error(response.data.error.message)
      } else {
        throw err
      }
    }
  }

  static async refreshToken (token: string) {
    try {
      const res = await api.get('/users/token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.data) {
        throw new Error('Invalid response from server')
      }

      if (res.data.status === 'error') {
        throw new Error(res.data.msg)
      }

      return res
    } catch (err) {
      const { response } = err

      if (response) {
        throw new Error(response.data.error.message)
      } else {
        throw err
      }
    }
  }
}
