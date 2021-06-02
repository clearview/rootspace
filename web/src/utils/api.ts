import axios from 'axios'

const api = axios.create({
  baseURL: baseURL()
})

export function setAPIToken (token: string | null) {
  api.defaults.headers.common.Authorization = token
    ? `Bearer ${token}`
    : null
}

export function baseURL (path = '/') {
  return process.env.VUE_APP_API_URL + '/' + path.replace(/^\/+/g, '')
}

export default api
