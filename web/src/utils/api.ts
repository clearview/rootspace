import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})

export function setAPIToken (token: string | null) {
  api.defaults.headers.common.Authorization = token
    ? `Bearer ${token}`
    : null
}

export default api
