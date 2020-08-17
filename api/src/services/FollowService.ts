import { getConnection, getCustomRepository, In } from 'typeorm'
import { FollowRepository } from '../database/repositories/FollowRepository'
import { Follow } from '../database/entities/Follow'
import { User } from '../database/entities/User'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { NotificationService } from './NotificationService'
import { UserService } from './UserService'
import { TaskBoardService, TaskListService } from './content/tasks'
import { ActivityEvent } from './events/ActivityEvent'
import { Notification } from '../database/entities/Notification'

export class FollowService {
  private static instance: FollowService
  private notificationService: NotificationService
  private userService: UserService
  private taskBoardService: TaskBoardService
  private taskListService: TaskListService

  private constructor() {
    this.notificationService = NotificationService.getInstance()
    this.userService = UserService.getInstance()
    this.taskBoardService = TaskBoardService.getInstance()
    this.taskListService = TaskListService.getInstance()
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

  async getFollows(activity: ActivityEvent): Promise<Follow[]> {
    const follows = await this.getFollowRepository().find({
      entityId: activity.entityId,
      tableName: activity.tableName
    })

    return follows.filter((follow) => { return follow.userId !== activity.actorId})
  }

  async getFollowerIds(event: ActivityEvent): Promise<number[]> {
    const follows = await this.getFollows(event)

    return follows.map((follow) => follow.userId)
  }

  async followFromRequest(userId: number, entity: any): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    return this.follow(user, entity)
  }

  async followFromActivity(activity: ActivityEvent): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(activity.actorId)
    const entity = await this.getFollowRepository().getEntityFromActivity(activity)
    return this.follow(user, entity)
  }

  async unfollowFromRequest(userId: number, entity: any): Promise<DeleteResult> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    return this.unfollow(user, entity)
  }

  // requires item of typeorm Entity type
  async follow(user: User, item: any): Promise<Follow> {
    const existingFollow = await this.getFollowRepository().findOne({
      userId: user.id,
      entityId: item.id
    })

    if (existingFollow) {
      return existingFollow
    }

    const follow = new Follow()
    follow.user = user
    follow.entityId = item.id
    follow.tableName = getConnection().getMetadata(item.constructor.name).tableName

    await this.getFollowRepository().save(follow)

    return this.getFollowRepository().reload(follow)
  }

  async unfollow(user: User, entity: any): Promise<DeleteResult> {
    const existingFollow = await this.getFollowRepository().findOne({
      userId: user.id,
      entityId: entity.id,
      tableName: getConnection().getMetadata(entity.constructor.name).tableName
    })

    if (existingFollow) {
      await this.removeAllItemNotificationsForUser(user, entity)
      return this.getFollowRepository().delete(existingFollow.id)
    }
  }

  async removeAllItemNotificationsForUser(user: User, entity: any): Promise<void> {
    return this.notificationService.removeUserNotificationsForItem(
      user.id,
      entity.id,
      getConnection().getMetadata(entity.constructor.name).tableName
    )
  }

  async removeAllNotificationsFromEntity(entity: any): Promise<DeleteResult> {
    return this.notificationService.delete({
      entityId: entity.id,
      tableName: getConnection().getMetadata(entity.constructor.name).tableName
    })
  }

  async shouldReceiveNotification(userId: number, activity: ActivityEvent): Promise<boolean> {
    const unreadNotification = await this.notificationService.getUnreadNotification(userId, activity)

    return !unreadNotification
  }

  async removeFollowsFromActivity(activity: ActivityEvent): Promise<DeleteResult | void> {
    const existingFollows = await this.getFollowRepository().find({
      entityId: activity.entityId,
      tableName: activity.tableName
    })

    const followIds = existingFollows.map((follow) => follow.id)

    if (!followIds || followIds.length < 1) { return null }

    return this.getFollowRepository().delete(followIds)
  }

  async removeFollowsForTaskBoard(activity: ActivityEvent): Promise<DeleteResult | void> {
    const tasks = await this.taskBoardService.getAllTasks(activity.entityId)
    const taskIds = tasks.map((task) => task.id)

    if (!taskIds || taskIds.length < 1) {
      return null
    }

    return this.removeFollowsForTasks(taskIds)
  }

  async removeFollowsForTaskBoardList(activity: ActivityEvent): Promise<DeleteResult | void> {
    const tasks = await this.taskListService.getAllTasks(activity.entityId)
    const taskIds = tasks.map((task) => task.id)

    if (!taskIds || taskIds.length < 1) { return null }

    return this.removeFollowsForTasks(taskIds)
  }

  async removeNotificationsForTasks(taskIds: number[]): Promise<void> {
    return this.notificationService.removeNotificationsForTasks(taskIds)
  }

  async removeFollowsForTasks(taskIds: number[]): Promise<DeleteResult | void> {
    const existingFollows = await this.getFollowRepository().getFollowsForTasks(taskIds)

    const followIds = existingFollows.map((follow) => follow.id)

    if (!followIds || followIds.length < 1) { return null }

    return this.getFollowRepository().delete(followIds)
  }
}
