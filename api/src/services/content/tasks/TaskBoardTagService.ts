import { getCustomRepository } from 'typeorm'
import { Tag } from '../../../entities/tasks/Tag'
import { TaskBoardTagRepository } from '../../../repositories/tasks/TaskBoardTagRepository'

export class TaskBoardTagService {
  private static instance: TaskBoardTagService

  static getInstance() {
    if (!TaskBoardTagService.instance) {
      TaskBoardTagService.instance = new TaskBoardTagService()
    }

    return TaskBoardTagService.instance
  }

  getTagRepository(): TaskBoardTagRepository {
    return getCustomRepository(TaskBoardTagRepository)
  }

  async getById(id: number): Promise<Tag> {
    return this.getTagRepository().findOneOrFail(id)
  }

  async create(tag: Tag): Promise<Tag> {
    return this.getTagRepository().save(tag)
  }

  async update(id: number, data: any): Promise<Tag> {
    let tag = await this.getById(id)
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
