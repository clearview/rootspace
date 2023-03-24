import api from '@/utils/api'

type SettingData = Record<string, any>

interface UserUISettingUpdateData {
  spaceId?: number
  data: object
}

export default class UserUISetting {
  static async fetch (spaceId?: number): Promise<SettingData> {
    try {
      const res = await api.get('users/settings/ui/' + (spaceId || ''))

      return res.data
    } catch {
      return {}
    }
  }

  static async update ({
    spaceId,
    data
  }: UserUISettingUpdateData): Promise<SettingData> {
    try {
      const res = await api.patch('users/settings/ui/' + (spaceId || ''), data)

      return res.data.ui
    } catch {
      return {}
    }
  }
}
