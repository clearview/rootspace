import { getConnection, getCustomRepository, DeleteResult } from 'typeorm'
import { FollowRepository } from '../database/repositories/FollowRepository'
import { Follow } from '../database/entities/Follow'
import { User } from '../database/entities/User'
import { Activity } from '../database/entities/Activity'
import { UserService } from './index'
import { ServiceFactory } from './factory/ServiceFactory'

export class FollowService {
  private static instance: FollowService
  private userService: UserService

  private constructor() {
    this.userService = ServiceFactory.getInstance().getUserService()
  }

  static getInstance() {
    if (!FollowService.instance) {
      FollowService.instance = new FollowService()
    }

    return FollowService.instance
  }

  getFollowRepository(): FollowRepository {
    return getCustomRepository(FollowRepository)
  }

  async getById(id: number): Promise<Follow> {
    return this.getFollowRepository().findOneOrFail(id)
  }

  async getFollowsForActivity(activity: Activity): Promise<Follow[]> {
    const follows = await this.getFollowRepository().find({
      entityId: activity.entityId,
      tableName: activity.tableName,
    })

    return follows.filter((follow) => {
      return follow.userId !== activity.actorId
    })
  }

  async followFromRequest(userId: number, entity: any): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    return this.follow(user, entity)
  }

  async unfollowFromRequest(userId: number, entity: any): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    return this.unfollow(user, entity)
  }

  async followEntity(userId: number, entity: any): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    return this.follow(user, entity)
  }

  async unfollowEntity(userId: number, entity: any): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    return this.unfollow(user, entity)
  }

  async follow(user: User, entity: any): Promise<Follow> {
    const follow = await this.getFollowRepository().findOne({
      userId: user.id,
      entityId: entity.id,
      entity: entity.constructor.name,
    })

    if (follow) {
      return follow
    }

    const newFollow = new Follow()

    newFollow.user = user
    newFollow.entityId = entity.id
    newFollow.entity = entity.constructor.name
    newFollow.tableName = getConnection().getMetadata(entity.constructor.name).tableName

    await this.getFollowRepository().save(newFollow)
    return this.getFollowRepository().reload(newFollow)
  }

  async unfollow(user: User, entity: any): Promise<Follow> {
    const follow = await this.getFollowRepository().findOne({
      userId: user.id,
      entityId: entity.id,
      entity: entity.constructor.name,
    })

    if (!follow) {
      return
    }

    return this.getFollowRepository().remove(follow)
  }

  async deleteByEntityAndEntityId(entity: string, entityId: number): Promise<DeleteResult> {
    return this.getFollowRepository().deleteByEntityAndEntityId(entity, entityId)
  }
}
