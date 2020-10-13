import { getConnection, getCustomRepository } from 'typeorm'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { FollowRepository } from '../database/repositories/FollowRepository'
import { Follow } from '../database/entities/Follow'
import { User } from '../database/entities/User'
import { Activity } from '../database/entities/Activity'
import { NotificationService, UserService, EntityService, TaskBoardService, TaskListService } from './index'
import { ServiceFactory } from './factory/ServiceFactory'

export class FollowService {
  private static instance: FollowService
  private notificationService: NotificationService
  private userService: UserService
  private entityService: EntityService
  private taskBoardService: TaskBoardService
  private taskListService: TaskListService

  private constructor() {
    this.notificationService = NotificationService.getInstance()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.entityService = ServiceFactory.getInstance().getEntityService()
    this.taskBoardService = ServiceFactory.getInstance().getTaskBoardService()
    this.taskListService = ServiceFactory.getInstance().getTaskListService()
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

  async shouldReceiveNotification(userId: number, activity: Activity): Promise<boolean> {
    const unreadNotification = await this.notificationService.getUnreadNotification(userId, activity)
    return !unreadNotification
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
}
