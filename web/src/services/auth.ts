import axios from 'axios'

async function googleCallback (params: object) {
  const { data } = await axios.get('auth/google/callback', { params })

  if (data.status === 'error') {
    throw new Error(data.msg)
  }

  return data
}

export default {
  googleCallback
}
