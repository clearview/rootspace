import axios from 'axios'
import store from '@/store'

const api = axios.create({
  baseURL: baseURL()
})

api.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalConfig = error.config

  if (originalConfig.url !== '/auth/signin' && error.response) {
    // Access Token was expired
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true

      try {
        store.dispatch('auth/refreshToken')

        return api(originalConfig)
      } catch (_error) {
        return Promise.reject(_error)
      }
    }
  }
})

export function setAPIToken (token: string | null) {
  if (api?.defaults) {
    api.defaults.headers.common.Authorization = token
      ? `Bearer ${token}`
      : null
  }
}

export function baseURL (path = '/') {
  return process.env.VUE_APP_API_URL + '/' + path.replace(/^\/+/g, '')
}

export default api
