import { getCustomRepository } from 'typeorm'
import { Tag } from '../../../database/entities/tasks/Tag'
import { TaskBoardTagRepository } from '../../../database/repositories/tasks/TaskBoardTagRepository'

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

  async getByTaskBoardId(id: number): Promise<Tag[]> {
    return this.getTagRepository().find({ boardId: id })
  }

  async create(data: any): Promise<Tag> {
    const tag = new Tag()
    tag.board = data.taskBoard
    tag.label = data.label
    tag.color = data.color

    await this.getTagRepository().save(tag)

    return this.getTagRepository().reload(tag)
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
