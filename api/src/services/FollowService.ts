import { getConnection, getCustomRepository, In } from 'typeorm'
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult'
import { FollowRepository } from '../database/repositories/FollowRepository'
import { Follow } from '../database/entities/Follow'
import { User } from '../database/entities/User'
import { Activity } from '../database/entities/Activity'
import { NotificationService, UserService, TaskBoardService, TaskListService } from './index'
import { ServiceFactory } from './factory/ServiceFactory'

export class FollowService {
  private static instance: FollowService
  private notificationService: NotificationService
  private userService: UserService
  private taskBoardService: TaskBoardService
  private taskListService: TaskListService

  private constructor() {
    this.notificationService = NotificationService.getInstance()
    this.userService = ServiceFactory.getInstance().getUserService()
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

  async unfollowFromRequest(userId: number, entity: any): Promise<DeleteResult> {
    const user = await this.userService.getUserRepository().findOneOrFail(userId)
    return this.unfollow(user, entity)
  }

  // requires item of typeorm Entity type
  async follow(user: User, item: any): Promise<Follow> {
    const follow = await this.getFollowRepository().findOne({
      userId: user.id,
      entityId: item.id,
    })

    if (follow) {
      return follow
    }

    const newFollow = new Follow()
    newFollow.user = user
    newFollow.entityId = item.id
    newFollow.tableName = getConnection().getMetadata(item.constructor.name).tableName

    await this.getFollowRepository().save(newFollow)
    return this.getFollowRepository().reload(newFollow)
  }

  async unfollow(user: User, entity: any): Promise<DeleteResult> {
    const follow = await this.getFollowRepository().findOne({
      userId: user.id,
      entityId: entity.id,
      tableName: getConnection().getMetadata(entity.constructor.name).tableName,
    })

    if (follow) {
      await this.notificationService.removeUserNotificationsForItem(
        user.id,
        entity.id,
        getConnection().getMetadata(entity.constructor.name).tableName
      )

      return this.getFollowRepository().delete(follow.id)
    }
  }

  async removeFollowsForActivity(activity: Activity): Promise<DeleteResult | void> {
    const existingFollows = await this.getFollowRepository().find({
      entityId: activity.entityId,
      tableName: activity.tableName,
    })

    const followIds = existingFollows.map((follow) => follow.id)

    if (!followIds || followIds.length < 1) {
      return null
    }

    return this.getFollowRepository().delete(followIds)
  }

  async removeFollowsForTaskBoard(activity: Activity): Promise<DeleteResult | void> {
    const tasks = await this.taskBoardService.getAllTasks(activity.entityId)
    const taskIds = tasks.map((task) => task.id)

    if (!taskIds || taskIds.length < 1) {
      return null
    }

    return this.removeFollowsForTasks(taskIds)
  }

  async removeFollowsForTaskBoardList(activity: Activity): Promise<void> {
    const tasks = await this.taskListService.getAllTasks(activity.entityId)
    const taskIds = tasks.map((task) => task.id)

    if (!taskIds || taskIds.length < 1) {
      return null
    }

    await this.removeFollowsForTasks(taskIds)
  }

  async removeFollowsForTasks(taskIds: number[]): Promise<DeleteResult | void> {
    const existingFollows = await this.getFollowRepository().getFollowsForTasks(taskIds)

    const followIds = existingFollows.map((follow) => follow.id)

    if (!followIds || followIds.length < 1) {
      return null
    }

    return this.getFollowRepository().delete(followIds)
  }
}
