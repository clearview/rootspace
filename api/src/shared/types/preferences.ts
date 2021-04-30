import { UserSetting } from '../../database/entities/UserSetting'
import { Notifications } from './preferences/notifications'

export class Preferences {
  notifications: Notifications

   constructor(userSetting: UserSetting) {
     const userPreferences = userSetting.preferences

     Object.assign(this, userPreferences)
  }
}
