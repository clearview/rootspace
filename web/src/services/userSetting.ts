import api from '@/utils/api'

export default class UserSetting {
  static async view (id: number) {
    const res = await api.get('users/settings/' + id)

    return res.data
  }

  static async update (id: number, data: object) {
    await api.post('users/settings/' + id, { data })
  }
}
