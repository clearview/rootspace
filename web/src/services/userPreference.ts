import api from '@/utils/api'

type SettingData = Record<string, any>

interface UserUISettingUpdateData {
  spaceId?: number
  data: object
}

export default class UserPreferences {
  static async fetch (spaceId?: number): Promise<SettingData> {
    try {
      const res = await api.get('users/settings/preferences/' + (spaceId || ''))

      return res.data.data
    } catch {
      return {}
    }
  }

  static async update ({
    spaceId,
    data
  }: UserUISettingUpdateData): Promise<SettingData> {
    try {
      const res = await api.patch('users/settings/preferences/' + (spaceId || ''), { data })

      return res.data.data.ui
    } catch {
      return {}
    }
  }
}
