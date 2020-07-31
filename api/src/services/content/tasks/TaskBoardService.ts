import httpRequestContext from 'http-request-context'
import { getCustomRepository } from 'typeorm'
import { DeepPartial } from 'typeorm/common/DeepPartial'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { TaskBoard } from '../../../database/entities/tasks/TaskBoard'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { NodeContentService } from '../NodeContentService'
import { NodeService } from '../NodeService'
import { NodeType } from '../../../types/node'
import { NodeCreateValue } from '../../../values/node'
import { Task } from '../../../database/entities/tasks/Task'
import { ActivityService } from '../../ActivityService'
import Bull from 'bull'
import { ActivityEvent } from '../../events/ActivityEvent'
import { TaskBoardActivities } from '../../../database/entities/activities/TaskBoardActivities'

export class TaskBoardService extends NodeContentService {
  private nodeService: NodeService
  private activityService: ActivityService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
    this.activityService = ActivityService.getInstance()
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

  async getAllTasks(id: number): Promise<Task[]> {
    const taskBoard = await this.getCompleteTaskboard(id)

    const tasks: Task[] = []

    for (const taskList of taskBoard.taskLists) {
      tasks.push(...taskList.tasks)
    }

    return tasks
  }

  async getByTaskId(id: number): Promise<TaskBoard> {
    const taskBoard = await this.getTaskBoardRepository().getByTaskId(id)

    return this.getCompleteTaskboard(taskBoard.id)
  }

  async getCompleteTaskboard(id: number, archived?: boolean): Promise<TaskBoard | undefined> {
    return this.getTaskBoardRepository()
        .getCompleteTaskboard(id, archived)
  }

  async searchTaskboard(id: number, searchParam?: string, filterParam?: any): Promise<TaskBoard> {
    return this.getTaskBoardRepository().searchTaskboard(id, searchParam, filterParam)
  }

  async create(data: DeepPartial<TaskBoard>): Promise<TaskBoard> {
    return this.getTaskBoardRepository().create(data)
  }

  async save(data: any): Promise<TaskBoard> {
    data.space = await this.getSpaceRepository().findOneOrFail(data.spaceId)
    let taskBoard = await this.getTaskBoardRepository().save(data)

    await this.nodeService.create(
      NodeCreateValue.fromObject({
        userId: taskBoard.userId,
        spaceId: taskBoard.spaceId,
        contentId: taskBoard.id,
        title: taskBoard.title,
        type: this.getNodeType(),
      })
    )

    taskBoard = await this.getTaskBoardRepository().reload(taskBoard)
    await this.registerActivityForTaskBoard(TaskBoardActivities.TaskBoard_Created, taskBoard)

    return taskBoard
  }

  async update(id: number, data: any): Promise<TaskBoard> {
    let taskBoard = await this.getById(id)
    taskBoard = await this.getTaskBoardRepository().save({
      ...taskBoard,
      ...data,
    })

    taskBoard = await this.getTaskBoardRepository().reload(taskBoard)
    await this.registerActivityForTaskBoard(TaskBoardActivities.TaskBoard_Updated, taskBoard)

    return taskBoard
  }

  async remove(id: number) {
    const taskBoard = await this.getById(id)
    await this.registerActivityForTaskBoard(TaskBoardActivities.TaskBoard_Deleted, taskBoard)

    await this.getTaskBoardRepository().remove(taskBoard)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType())

    return taskBoard
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const taskBoard = await this.getTaskBoardRepository().findOne({id: contentId})
    await this.registerActivityForTaskBoard(TaskBoardActivities.TaskBoard_Deleted, taskBoard)
    await this.getTaskBoardRepository().remove(taskBoard)
  }

  async registerActivityForTaskBoardId(taskBoardActivity: TaskBoardActivities, taskBoardId: number): Promise<Bull.Job> {
    const taskBoard = await this.getById(taskBoardId)
    return this.registerActivityForTaskBoard(taskBoardActivity, taskBoard)
  }

  async registerActivityForTaskBoard(taskBoardActivity: TaskBoardActivities, taskBoard: TaskBoard): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent
        .withAction(taskBoardActivity)
        .fromActor(actor.id)
        .forEntity(taskBoard)
        .inSpace(taskBoard.spaceId)
    )
  }
}
