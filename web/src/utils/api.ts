import axios from 'axios'
import router from '../router'
import Vue from 'vue'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})

api.interceptors.response.use(value => {
  return value
}, error => {
  if (error && error.response && error.response.status === 403) {
    Vue.nextTick(() => {
      router.replace('/forbidden').catch(() => null)
    })
  } else if (error && error.response && error.response.status === 404) {
    Vue.nextTick(() => {
      router.replace('/not-found').catch(() => null)
    })
  }
  return error
})

export function setAPIToken (token: string | null) {
  api.defaults.headers.common.Authorization = token
    ? `Bearer ${token}`
    : null
}

export default api
