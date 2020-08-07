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
import { INodeContentUpdate } from '../contracts'
import { ActivityService } from '../../ActivityService'
import Bull from 'bull'
import { ActivityEvent } from '../../events/ActivityEvent'
import { TaskBoardActivities } from '../../../database/entities/activities/TaskBoardActivities'
import { UpdateResult } from 'typeorm/index'
import { TaskListService } from './TaskListService'

export class TaskBoardService extends NodeContentService {
  private nodeService: NodeService
  private activityService: ActivityService
  private taskListService: TaskListService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
    this.activityService = ServiceFactory.getInstance().getActivityService()
    this.taskListService = ServiceFactory.getInstance().getTaskListService()
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

  async getArchivedById(id: number): Promise<TaskBoard | undefined> {
    return this.getTaskBoardRepository().findOneArchived(id)
  }

  async getAllTasks(id: number): Promise<Task[]> {
    const taskBoard = await this.getCompleteTaskboard(id)

    const tasks: Task[] = []

    if (!taskBoard || taskBoard.taskLists.length < 1) {
      return tasks
    }

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
    await this.registerActivityForTaskBoard(TaskBoardActivities.Created, taskBoard)

    return taskBoard
  }

  async update(id: number, data: any): Promise<TaskBoard> {
    let taskBoard = await this.getById(id)

    taskBoard = await this.getTaskBoardRepository().save({
      ...taskBoard,
      ...data,
    })

    taskBoard = await this.getTaskBoardRepository().reload(taskBoard)

    await this.nodeContentMediator.contentUpdated(
      taskBoard.id,
      this.getNodeType(),
      {
        title: taskBoard.title,
      }
    )

    await this.registerActivityForTaskBoard(
      TaskBoardActivities.Updated,
      taskBoard
    )

    return taskBoard
  }

  async archive(taskBoardId: number): Promise<UpdateResult> {
    await this.registerActivityForTaskBoardId(TaskBoardActivities.Archived, taskBoardId)

    const taskBoard = await this.getCompleteTaskboard(taskBoardId)
    for(const taskList of taskBoard.taskLists) {
      await this.taskListService.archive(taskList.id)
    }

    return this.getTaskBoardRepository().softDelete({id: taskBoardId})
  }

  async restore(taskBoardId: number): Promise<UpdateResult> {
    const restoredTaskBoard = await this.getTaskBoardRepository().restore({id: taskBoardId})
    await this.registerActivityForTaskBoardId(TaskBoardActivities.Restored, taskBoardId)

    return restoredTaskBoard
  }

  async remove(id: number) {
    const taskBoard = await this.getById(id)
    await this.registerActivityForTaskBoard(TaskBoardActivities.Deleted, taskBoard)

    await this.getTaskBoardRepository().remove(taskBoard)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType())

    return taskBoard
  }

  async nodeUpdated(
    contentId: number,
    data: INodeContentUpdate
  ): Promise<void> {
    if (!data.title) {
      return
    }

    const taskBoard = await this.getById(contentId)

    if (!taskBoard) {
      return
    }

    taskBoard.title = data.title
    await this.getTaskBoardRepository().save(taskBoard)
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const taskBoard = await this.getTaskBoardRepository().findOne({id: contentId})
    await this.registerActivityForTaskBoard(TaskBoardActivities.Deleted, taskBoard)
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
