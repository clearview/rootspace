import { getCustomRepository } from 'typeorm'
import { DeepPartial } from 'typeorm/common/DeepPartial'
import { TaskBoardRepository } from '../../../repositories/tasks/TaskBoardRepository'
import { TaskBoard } from '../../../database/entities/tasks/TaskBoard'
import { SpaceRepository } from '../../../repositories/SpaceRepository'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { NodeContentService } from '../NodeContentService'
import { NodeService } from '../NodeService'
import { NodeType } from '../../../types/node'
import { NodeCreateValue } from '../../../values/node'

export class TaskBoardService extends NodeContentService {
  private nodeService: NodeService
  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
  }

  private static instance: TaskBoardService

  static getInstance() {
    if (!TaskBoardService.instance) {
      TaskBoardService.instance = new TaskBoardService()
    }

    return TaskBoardService.instance
  }

  getSpaceRepository(): SpaceRepository {
    return getCustomRepository(SpaceRepository)
  }

  getTaskBoardRepository(): TaskBoardRepository {
    return getCustomRepository(TaskBoardRepository)
  }

  getNodeType() {
    return NodeType.TaskBoard
  }

  async getById(id: number): Promise<TaskBoard> {
    return this.getTaskBoardRepository().findOneOrFail(id)
  }

  async getByTaskId(id: number): Promise<TaskBoard> {
    const taskBoard = await this.getTaskBoardRepository().getByTaskId(id)

    return this.getCompleteTaskboard(taskBoard.id)
  }

  async getCompleteTaskboard(id: number, archived?: boolean): Promise<TaskBoard | undefined> {
    return this.getTaskBoardRepository().getCompleteTaskboard(id, archived)
  }

  async searchTaskboard(id: number, searchParam?: string, filterParam?: any): Promise<TaskBoard> {
    return this.getTaskBoardRepository().searchTaskboard(id, searchParam, filterParam)
  }

  async create(data: DeepPartial<TaskBoard>): Promise<TaskBoard> {
    return this.getTaskBoardRepository().create(data)
  }

  async save(data: any): Promise<TaskBoard> {
    data.space = await this.getSpaceRepository().findOneOrFail(data.spaceId)
    const taskBoard = await this.getTaskBoardRepository().save(data)

    await this.nodeService.create(
      NodeCreateValue.fromObject({
        userId: taskBoard.userId,
        spaceId: taskBoard.spaceId,
        contentId: taskBoard.id,
        title: taskBoard.title,
        type: this.getNodeType(),
      })
    )

    return taskBoard
  }

  async update(id: number, data: any): Promise<TaskBoard> {
    let taskBoard = await this.getById(id)
    taskBoard = await this.getTaskBoardRepository().save({
      ...taskBoard,
      ...data,
    })

    return this.getTaskBoardRepository().reload(taskBoard)
  }

  async delete(id: number) {
    const res = await this.getTaskBoardRepository().delete({ id })

    if (res.affected > 0) {
      await this.mediator.contentDeleted(id, this.getNodeType())
    }

    return res
  }

  async nodeDeleted(contentId: number): Promise<void> {
    await this.getTaskBoardRepository().delete({ id: contentId })
  }
}
