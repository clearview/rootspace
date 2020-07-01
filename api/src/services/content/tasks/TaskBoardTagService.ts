import { getCustomRepository } from 'typeorm'
import { Tag } from '../../../entities/tasks/Tag'
import { TaskBoardTagRepository } from '../../../repositories/tasks/TaskBoardTagRepository'
import { TaskBoardService } from './TaskBoardService'

export class TaskBoardTagService {
  private static instance: TaskBoardTagService
  private taskBoardService: TaskBoardService

  private constructor() {
    this.taskBoardService = TaskBoardService.getInstance()
  }
  static getInstance() {
    if (!TaskBoardTagService.instance) {
      TaskBoardTagService.instance = new TaskBoardTagService()
    }

    return TaskBoardTagService.instance
  }

  getTagRepository(): TaskBoardTagRepository {
    return getCustomRepository(TaskBoardTagRepository)
  }

  async getTagById(id: number): Promise<Tag> {
    return this.getTagRepository().findOneOrFail(id)
  }

  async create(data: any): Promise<Tag> {
    const taskBoard = await this.taskBoardService.getById(data.taskBoardId)

    const tag = new Tag()
    tag.board = taskBoard
    tag.label = data.label
    tag.color = data.color

    await this.getTagRepository().save(tag)

    return this.getTagRepository().reload(tag)
  }

  async update(id: number, data: any): Promise<Tag> {
    let tag = await this.getTagById(id)
    tag = await this.getTagRepository().save({
      ...tag,
      ...data
    })

    return this.getTagRepository().reload(tag)
  }

  async delete(id: number) {
    return this.getTagRepository().delete({id})
  }
}
