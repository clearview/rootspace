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
import { TaskListService } from './TaskListService'
import { HttpErrName, HttpStatusCode, clientError } from '../../../errors'

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

  getById(id: number, options: any = {}): Promise<TaskBoard> {
    return this.getTaskBoardRepository().getById(id, options)
  }

  async requireById(id: number, options: any = {}): Promise<TaskBoard> {
    const taskBoard = await this.getById(id, options)

    if (!taskBoard) {
      throw clientError('Task board not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return taskBoard
  }

  async getAllTasks(id: number): Promise<Task[]> {
    const taskBoard = await this.getCompleteTaskBoard(id)

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

    return this.getCompleteTaskBoard(taskBoard.id)
  }

  async getCompleteTaskBoard(id: number): Promise<TaskBoard | undefined> {
    return this.getTaskBoardRepository().getCompleteTaskBoard(id)
  }

  async getFullTaskBoard(id: number): Promise<TaskBoard | undefined> {
    return this.getTaskBoardRepository().getFullTaskBoard(id)
  }

  async getArchivedTaskBoardById(id: number): Promise<TaskBoard | undefined> {
    return this.getTaskBoardRepository().findOneArchived(id)
  }

  async searchTaskBoard(id: number, searchParam?: string, filterParam?: any): Promise<TaskBoard> {
    return this.getTaskBoardRepository().searchTaskBoard(id, searchParam, filterParam)
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

    await this.nodeContentMediator.contentUpdated(taskBoard.id, this.getNodeType(), {
      title: taskBoard.title,
    })

    await this.registerActivityForTaskBoard(TaskBoardActivities.Updated, taskBoard)

    return taskBoard
  }

  async nodeUpdated(contentId: number, data: INodeContentUpdate): Promise<void> {
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

  async archive(taskBoardId: number): Promise<TaskBoard> {
    let taskBoard = await this.getFullTaskBoard(taskBoardId)
    this.verifyArchive(taskBoard)

    taskBoard = await this._archive(taskBoard)

    await this.nodeService.contentArchived(taskBoardId, this.getNodeType())
    await this.registerActivityForTaskBoardId(TaskBoardActivities.Archived, taskBoardId)

    return taskBoard
  }

  async nodeArchived(contentId: number): Promise<void> {
    const taskBoard = await this.getFullTaskBoard(contentId)

    if (!taskBoard) {
      return
    }

    await this._archive(taskBoard)
  }

  private async _archive(taskBoard: TaskBoard): Promise<TaskBoard> {
    if (taskBoard.taskLists) {
      for (const taskList of taskBoard.taskLists) {
        await this.taskListService.archive(taskList.id)
      }
    }

    return this.getTaskBoardRepository().softRemove(taskBoard)
  }

  async restore(taskBoardId: number): Promise<TaskBoard> {
    let taskBoard = await this.getArchivedTaskBoardById(taskBoardId)
    this.verifyRestore(taskBoard)

    taskBoard = await this._restore(taskBoard)

    await this.nodeService.contentRestored(taskBoardId, this.getNodeType())
    await this.registerActivityForTaskBoardId(TaskBoardActivities.Restored, taskBoard.id)

    return taskBoard
  }

  async nodeRestored(contentId: number) {
    const taskBoard = await this.getArchivedTaskBoardById(contentId)

    if (!taskBoard) {
      return
    }

    await this._restore(taskBoard)
  }

  private async _restore(taskBoard: TaskBoard): Promise<TaskBoard> {
    if (taskBoard.taskLists) {
      for (const taskList of taskBoard.taskLists) {
        await this.taskListService.restore(taskList.id)
      }
    }

    const recoveredTaskBoard = await this.getTaskBoardRepository().recover(taskBoard)
    return this.getCompleteTaskBoard(recoveredTaskBoard.id)
  }

  async remove(id: number) {
    const taskBoard = await this.requireById(id, { withDeleted: true })
    // this.verifyRemove(taskBoard)

    await this.getTaskBoardRepository().remove(taskBoard)

    await this.nodeContentMediator.contentRemoved(id, this.getNodeType())
    await this.registerActivityForTaskBoard(TaskBoardActivities.Deleted, taskBoard)

    return taskBoard
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const taskBoard = await this.getById(contentId, { withDeleted: true })

    await this.getTaskBoardRepository().remove(taskBoard)
    await this.registerActivityForTaskBoard(TaskBoardActivities.Deleted, taskBoard)
  }

  private verifyArchive(taskBoard: TaskBoard): void {
    if (taskBoard.deletedAt !== null) {
      throw clientError('Can not archive taks board', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRestore(taskBoard: TaskBoard) {
    if (taskBoard.deletedAt === null) {
      throw clientError('Can not restore task board', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRemove(taskBoard: TaskBoard): void {
    if (taskBoard.deletedAt === null) {
      throw clientError('Can not delete task board', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  async registerActivityForTaskBoardId(taskBoardActivity: TaskBoardActivities, taskBoardId: number): Promise<Bull.Job> {
    const taskBoard = await this.getById(taskBoardId, { withDeleted: true })
    return this.registerActivityForTaskBoard(taskBoardActivity, taskBoard)
  }

  async registerActivityForTaskBoard(taskBoardActivity: TaskBoardActivities, taskBoard: TaskBoard): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent.withAction(taskBoardActivity)
        .fromActor(actor.id)
        .forEntity(taskBoard)
        .inSpace(taskBoard.spaceId)
    )
  }
}
