import { getCustomRepository } from 'typeorm'
import { TaskCommentRepository } from '../../../database/repositories/tasks/TaskCommentRepository'
import { TaskComment } from '../../../database/entities/tasks/TaskComment'
import { TaskActivities, TaskActivity } from '../../../database/entities/tasks/TaskActivity'
import { TaskService } from './TaskService'

export class TaskCommentService {
  private static instance: TaskCommentService
  private taskService: TaskService

  private constructor() {
    this.taskService = TaskService.getInstance()
  }

  static getInstance() {
    if (!TaskCommentService.instance) {
      TaskCommentService.instance = new TaskCommentService()
    }

    return TaskCommentService.instance
  }

  getTaskCommentRepository(): TaskCommentRepository {
    return getCustomRepository(TaskCommentRepository)
  }

  async getById(id: number): Promise<TaskComment> {
    return this.getTaskCommentRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<TaskComment> {
    data.task = await this.taskService.getById(data.taskId)

    const taskComment = await this.getTaskCommentRepository().save(data)
    await this.noteActivityForId(taskComment.id, TaskActivities.Comment_Created)
    return this.getTaskCommentRepository().reload(taskComment)
  }

  async update(id: number, data: any): Promise<TaskComment> {
    let taskComment = await this.getById(id)
    taskComment = await this.getTaskCommentRepository().save({
      ...taskComment,
      ...data,
    })

    await this.noteActivityForTaskComment(taskComment, TaskActivities.Comment_Updated)

    return this.getTaskCommentRepository().reload(taskComment)
  }

  async delete(taskCommentId: number) {
    await this.noteActivityForId(taskCommentId, TaskActivities.Comment_Deleted)
    return this.getTaskCommentRepository().delete({ id: taskCommentId })
  }

  async noteActivityForId(taskCommentId: number, taskActivity: TaskActivities): Promise<TaskActivity> {
    const taskComment = await this.getById(taskCommentId)
    return this.noteActivityForTaskComment(taskComment, taskActivity)
  }

  async noteActivityForTaskComment(taskComment: TaskComment, taskActivity: TaskActivities): Promise<TaskActivity> {
    const task = await this.taskService.getById(taskComment.taskId)
    return this.taskService.noteActivityForTask(task, taskActivity)
  }
}
