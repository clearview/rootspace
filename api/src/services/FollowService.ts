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

  async followEntity<T>(userId: number, entityName: string, entityId: number): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    const entity = await this.entityService.requireEntityByNameAndId<T>(entityName, entityId)

    return this.follow(user, entity)
  }

  async unfollowEntity<T>(userId: number, entityName: string, entityId: number): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    const entity = await this.entityService.requireEntityByNameAndId<T>(entityName, entityId)

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

  async removeFollowsForEntity(entity: string, entityId: number): Promise<DeleteResult | void> {
    const follows = await this.getFollowRepository().find({
      entityId,
      entity,
    })

    const ids = follows.map((follow) => follow.id)

    if (ids.length === 0) {
      return null
    }

    return this.getFollowRepository().delete(ids)
  }

  async removeFollowsForTaskBoard(taskBoardId: number): Promise<DeleteResult | void> {
    const tasks = await this.taskBoardService.getAllTasks(taskBoardId)
    const taskIds = tasks.map((task) => task.id)

    if (!taskIds || taskIds.length < 1) {
      return null
    }

    return this.removeFollowsForTasks(taskIds)
  }

  async removeFollowsForTaskBoardList(taskListId: number): Promise<void> {
    const tasks = await this.taskListService.getAllTasks(taskListId)
    const taskIds = tasks.map((task) => task.id)

    if (!taskIds || taskIds.length < 1) {
      return null
    }

    await this.removeFollowsForTasks(taskIds)
  }

  async removeFollowsForTasks(taskIds: number[]): Promise<DeleteResult | void> {
    const follows = await this.getFollowRepository().getFollowsForTasks(taskIds)

    const followIds = follows.map((follow) => follow.id)

    if (!followIds || followIds.length < 1) {
      return null
    }

    return this.getFollowRepository().delete(followIds)
  }
}
