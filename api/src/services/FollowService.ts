import { getConnection, getCustomRepository, In } from 'typeorm'
import { FollowRepository } from '../repositories/FollowRepository'
import { Follow } from '../database/entities/Follow'
import { User } from '../database/entities/User'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { IEventProvider } from './events/EventType'
import { NotificationService } from './NotificationService'
import { UserService } from './UserService'
import { TaskBoardService } from './content/tasks'
import { Task } from '../database/entities/tasks/Task'
import { Node } from '../database/entities/Node'
import { NodeRepository } from '../repositories/NodeRepository'

export class FollowService {
  private static instance: FollowService
  private notificationService: NotificationService
  private userService: UserService
  private taskBoardService: TaskBoardService

  private constructor() {
    this.notificationService = NotificationService.getInstance()
    this.userService = UserService.getInstance()
    this.taskBoardService = TaskBoardService.getInstance()
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

  async getFollows(event: IEventProvider): Promise<Follow[]> {
    const follows = await this.getFollowRepository().find({
      itemId: event.itemId,
      tableName: event.tableName
    })

    return follows.filter((follow) => { return follow.userId !== event.actorId})
  }

  async followFromRequest(userId: number, entity: any): Promise<Follow> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
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
      itemId: item.id
    })

    if (existingFollow) {
      return existingFollow
    }

    const follow = new Follow()
    follow.user = user
    follow.itemId = item.id
    follow.tableName = getConnection().getMetadata(item.constructor.name).tableName

    await this.getFollowRepository().save(follow)

    return this.getFollowRepository().reload(follow)
  }

  async unfollow(user: User, entity: any): Promise<DeleteResult> {
    const existingFollow = await this.getFollowRepository().findOne({
      userId: user.id,
      itemId: entity.id
    })

    if (existingFollow) {
      await this.removeAllNotificationsFromEntity(entity)
      return this.getFollowRepository().delete(existingFollow.id)
    }
  }

  async removeAllFromEntity(entity: any): Promise<DeleteResult> {
    const itemId = entity.id
    const tableName = getConnection().getMetadata(entity.constructor.name).tableName

    const existingFollow = await this.getFollowRepository().find({ itemId, tableName })

    if (!existingFollow) {
      return
    }

    const followIds = existingFollow.map((follow) => { return follow.id })

    if (followIds.length > 0) {
      await this.removeAllNotificationsFromEntity(entity)
      return this.getFollowRepository().delete(followIds)
    }
  }

  async removeAllNotificationsFromEntity(entity: any): Promise<DeleteResult> {
    return this.notificationService.delete({
      itemId: entity.id,
      tableName: getConnection().getMetadata(entity.constructor.name).tableName
    })
  }

  async createNotifications(event: IEventProvider): Promise<Follow[]> {
    const follows = await this.getFollows(event)

    const notifications = []

    for (const follow of follows) {
      const existingNotification = await this.notificationService.getExistingNotification(event, follow)
      if (existingNotification) { break }

      event.userId = follow.userId

      const notification = await this.notificationService.create(event)

      notifications.push(notification)
    }

    return this.notificationService.save(notifications)
  }

  async removeFollowsAndNotifications(event: IEventProvider): Promise<DeleteResult | void> {
    await this.removeAllNotificationsFromEvent(event)

    const existingFollows = await this.getFollowRepository().find({
      itemId: event.itemId,
      tableName: event.tableName
    })

    const followIds = existingFollows.map((follow) => follow.id)

    if (!followIds) {
      return null
    }

    return this.getFollowRepository().delete(followIds)
  }

  async removeAllNotificationsFromEvent(event: IEventProvider): Promise<DeleteResult> {
    return this.notificationService.delete({
      itemId: event.itemId,
      tableName: event.tableName
    })
  }

  async removeFollowsAndNotificationsForTaskBoard(event: IEventProvider): Promise<DeleteResult | void> {
    const tasks = await this.taskBoardService.getAllTasks(event.itemId)

    await Promise.all(
        tasks.map(async (task: Task) => {
          return this.notificationService.delete({
            itemId: task.id,
            tableName: 'tasks'
          })
        })
    )

    const existingFollows = await this.getFollowRepository().find({
      itemId: In(tasks.filter((task) => task.id)),
      tableName: 'tasks'
    })

    const followIds = existingFollows.map((follow) => follow.id)

    if (!followIds) {
      return null
    }

    return this.getFollowRepository().delete(followIds)
  }

}
