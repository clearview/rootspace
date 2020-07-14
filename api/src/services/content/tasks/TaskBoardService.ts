import { Brackets, getCustomRepository } from 'typeorm'
import { DeepPartial } from 'typeorm/common/DeepPartial'
import { TaskBoardRepository } from '../../../repositories/tasks/TaskBoardRepository'
import { TaskRepository } from '../../../repositories/tasks/TaskRepository'
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

  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  getNodeType() {
    return NodeType.TaskBoard
  }

  async getById(id: number): Promise<TaskBoard> {
    return this.getTaskBoardRepository().findOneOrFail(id)
  }

  async getByTaskId(id: number): Promise<TaskBoard> {
    const taskBoard = await this.getTaskBoardRepository()
      .createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .where('task.id = :id', { id })
      .andWhere('task.deletedAt IS NULL')
      .getOne()

    return this.getCompleteTaskboard(taskBoard.id)
  }

  async getCompleteTaskboard(
    id: number,
    archived?: boolean
  ): Promise<TaskBoard | undefined> {
    const queryBuilder = this.getTaskBoardRepository()
      .createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .leftJoinAndSelect('taskList.tasks', 'task')
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .where('taskBoard.id = :id', { id })

    if (archived) {
      queryBuilder.andWhere('task.deletedAt IS NOT NULL')
      return queryBuilder.getOne()
    }

    queryBuilder.andWhere('task.deletedAt IS NULL')
    return queryBuilder.getOne()
  }

  async searchTaskboard(
    id: number,
    searchParam?: string,
    filterParam?: any
  ): Promise<TaskBoard | undefined> {
    const board = await this.getTaskBoardRepository()
      .createQueryBuilder('taskBoard')
      .leftJoinAndSelect('taskBoard.taskLists', 'taskList')
      .where('taskBoard.id = :id', { id })
      .getOne()

    const taskQuery = this.getTaskRepository()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.assignees', 'assignee')
      .leftJoinAndSelect('task.taskComments', 'comment')
      .innerJoin('task.list', 'taskList')
      .innerJoin('taskList.board', 'taskBoard')
      .where('taskBoard.id = :id', { id })
      .andWhere('task.deletedAt IS NULL')

    if (searchParam) {
      taskQuery.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(task.title) LIKE :searchParam', {
            searchParam: `%${searchParam.toLowerCase()}%`,
          })
            .orWhere('LOWER(task.description) LIKE :searchParam', {
              searchParam: `%${searchParam.toLowerCase()}%`,
            })
            .orWhere('task.id IS NULL')
        })
      )
    }

    if (
      typeof filterParam?.status !== 'undefined' &&
      filterParam?.status !== null
    ) {
      taskQuery.andWhere('task.status = :status', {
        status: filterParam.status,
      })
    }

    if (filterParam?.assignees?.length > 0) {
      taskQuery.andWhere('assignee.id IN (:...assignees)', {
        assignees: filterParam.assignees,
      })
    }

    if (filterParam?.tags?.length > 0) {
      taskQuery.andWhere('tag.id IN (:...tags)', { tags: filterParam.tags })
    }

    const tasks = await taskQuery.getMany()

    if (tasks.length === 0 || board.taskLists.length === 0) {
      return board
    }

    for (const list of board.taskLists) {
      if (!list.tasks) {
        list.tasks = []
      }

      for (const task of tasks) {
        if (task.listId === list.id) {
          list.tasks.push(task)
        }
      }
    }

    return board
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

    return board
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
