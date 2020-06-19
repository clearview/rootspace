import { getCustomRepository, UpdateResult, DeleteResult, SelectQueryBuilder } from 'typeorm'
import { TaskBoardRepository } from '../../../repositories/tasks/TaskBoardRepository'
import { TaskBoard } from '../../../entities/tasks/TaskBoard'
import { DeepPartial } from 'typeorm/common/DeepPartial'
import { SpaceRepository } from '../../../repositories/SpaceRepository'

export class TaskBoardService {
  private constructor() {}

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

  async getById(id: number): Promise<TaskBoard> {
    return this.getTaskBoardRepository().findOneOrFail(id)
  }

  async getCompleteTaskboard(id: number, archived: boolean): Promise<TaskBoard | undefined> {
    const queryBuilder =  this.getTaskBoardRepository()
        .createQueryBuilder('taskBoard')
        .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
        .leftJoinAndSelect('taskList.tasks', 'task')
        .where('taskBoard.id = :id', { id })

        if (archived) {
          queryBuilder.andWhere('task.deletedAt IS NOT NULL')
          return queryBuilder.getOne()
        }

        queryBuilder.andWhere('task.deletedAt IS NULL')
        return queryBuilder.getOne()
  }

  async create(data: DeepPartial<TaskBoard>): Promise<TaskBoard> {
    return this.getTaskBoardRepository().create(data)
  }

  async save(data: any): Promise<TaskBoard> {
    data.space = await this.getSpaceRepository().findOneOrFail(data.spaceId)
    const taskBoard = await this.getTaskBoardRepository().save(data)
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
    const taskBoard = await this.getById(id)

    const res = await this.getTaskBoardRepository().delete({ id })
    return res
  }
}
