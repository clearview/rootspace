import { getCustomRepository } from 'typeorm'
import { PasswordResetRepository } from '../database/repositories/PasswordResetRepository'
import { UserSettingRepository } from '../database/repositories/UserSettingRepository'
import { UserSetting } from '../database/entities/UserSetting'
import { UserService } from './user/UserService'

export class UserSettingService {
  private userService: UserService
  private static instance: UserSettingService

  private constructor() {
    this.userService = UserService.getInstance()
  }

  static getInstance() {
    if (!UserSettingService.instance) {
      UserSettingService.instance = new UserSettingService()
    }

    return UserSettingService.instance
  }

  getUserSettingRepository() {
    return getCustomRepository(UserSettingRepository)
  }

  getPasswordResetRepository() {
    return getCustomRepository(PasswordResetRepository)
  }

  getSettings(userId: number, spaceId?: number): Promise<UserSetting> {
    return this.getUserSettingRepository().getOne(userId, spaceId)
  }

  async updateSettingsUi(userId: number, spaceId?: number, data?: any): Promise<UserSetting> {
    let settings = await this.getSettings(userId, spaceId)

    if (!settings) {
      settings = await this.createSettings(userId, spaceId, data)
    }

    settings.ui = data

    settings = await this.getUserSettingRepository().save(settings)

    return settings
  }

  async updateSettingsPreferences(userId: number, spaceId?: number, data?: any): Promise<UserSetting> {
    let settings = await this.getSettings(userId, spaceId)

    if (!settings) {
      settings = await this.createSettings(userId, spaceId, data)
    }

    settings.preferences = data

    settings = await this.getUserSettingRepository().save(settings)

    return settings
  }

  async createSettings(userId: number, spaceId?: number, data?: any): Promise<UserSetting> {
    const settings = new UserSetting()
    settings.userId = userId

    if (spaceId) {
      settings.spaceId = spaceId
    }

    if (data) {
      settings.ui = data.ui
      delete data.ui
    }

    if (data?.preferences) {
      settings.preferences = data.preferences
    }

    return this.getUserSettingRepository().save(settings)
  }
}
