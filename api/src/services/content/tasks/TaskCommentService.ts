import { getCustomRepository } from 'typeorm'
import { TaskRepository } from '../../../database/repositories/tasks/TaskRepository'
import { TaskCommentRepository } from '../../../database/repositories/tasks/TaskCommentRepository'
import { TaskComment } from '../../../database/entities/tasks/TaskComment'
import { TaskActivityService } from './TaskActivityService'
import { TaskActivities } from '../../../database/entities/tasks/TaskActivity'

export class TaskCommentService {
  private static instance: TaskCommentService
  private activityService: TaskActivityService

  private constructor() {
    this.activityService = TaskActivityService.getInstance()
  }

  static getInstance() {
    if (!TaskCommentService.instance) {
      TaskCommentService.instance = new TaskCommentService()
    }

    return TaskCommentService.instance
  }

  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  getTaskCommentRepository(): TaskCommentRepository {
    return getCustomRepository(TaskCommentRepository)
  }

  async getById(id: number): Promise<TaskComment> {
    return this.getTaskCommentRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<TaskComment> {
    data.task = await this.getTaskRepository().findOneOrFail(data.taskId)

    const taskComment = await this.getTaskCommentRepository().save(data)

    await this.activityService.create({
      userId: data.user.id,
      taskId: taskComment.taskId,
      content: TaskActivities.Comment_Created
    })

    return this.getTaskCommentRepository().reload(taskComment)
  }

  async update(id: number, data: any): Promise<TaskComment> {
    let taskComment = await this.getById(id)
    taskComment = await this.getTaskCommentRepository().save({
      ...taskComment,
      ...data,
    })

    return this.getTaskCommentRepository().reload(taskComment)
  }

  async delete(actorId: number, taskCommentId: number) {
    await this.activityService.create({
      userId: actorId,
      taskId: taskCommentId,
      content: TaskActivities.Comment_Deleted
    })

    return this.getTaskCommentRepository().delete({ id: taskCommentId })
  }
}
