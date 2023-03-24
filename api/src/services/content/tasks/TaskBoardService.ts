import { getCustomRepository } from 'typeorm'
import { DeepPartial } from 'typeorm/common/DeepPartial'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { TaskBoard } from '../../../database/entities/tasks/TaskBoard'
import { Task } from '../../../database/entities/tasks/Task'
import { Node } from '../../../database/entities/Node'
import { NodeType } from '../../../shared/constants'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { NodeContentService } from '../NodeContentService'
import { NodeService, TaskListService } from '../../'
import { NodeCreateValue } from '../node/values'
import { HttpErrName, HttpStatusCode, clientError } from '../../../response/errors'
import { TaskBoardActivity } from '../../activity/activities/content/TaskBoardActivity'

export class TaskBoardService extends NodeContentService {
  private nodeService: NodeService
  private taskListService: TaskListService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
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

  async save(data: any, parentId?: number): Promise<TaskBoard & Node> {
    data.space = await this.getSpaceRepository().findOneOrFail(data.spaceId)
    let taskBoard = await this.getTaskBoardRepository().save(data)

    let value = NodeCreateValue.fromObject({
      userId: taskBoard.userId,
      spaceId: taskBoard.spaceId,
      contentId: taskBoard.id,
      title: taskBoard.title,
      type: this.getNodeType(),
    })
    if (parentId) {
      value = value.withParent(parentId).withPosition(0)
    }

    const node = await this.nodeService.create(value)

    taskBoard = await this.getTaskBoardRepository().reload(taskBoard)
    await this.notifyActivity(TaskBoardActivity.created(taskBoard, taskBoard.userId))

    return { ...taskBoard, ...node }
  }

  async update(id: number, data: any, actorId: number): Promise<TaskBoard> {
    const existingTaskBoard = await this.getById(id)
    let taskBoard = await this.getById(id)

    taskBoard = await this.getTaskBoardRepository().save({
      ...taskBoard,
      ...data,
    })

    taskBoard = await this.getTaskBoardRepository().reload(taskBoard)

    await this.nodeContentMediator.contentUpdated(taskBoard.id, this.getNodeType(), actorId, { title: taskBoard.title })
    await this.notifyActivity(TaskBoardActivity.updated(existingTaskBoard, taskBoard, actorId))

    return taskBoard
  }

  async nodeUpdated(node: Node, actorId: number): Promise<void> {
    const taskBoard = await this.getById(node.contentId)

    if (!taskBoard) {
      return
    }

    const updatedTaskBoard = await this.getById(node.contentId)
    updatedTaskBoard.title = node.title

    await this.getTaskBoardRepository().save(updatedTaskBoard)
    await this.notifyActivity(TaskBoardActivity.updated(taskBoard, updatedTaskBoard, actorId))
  }

  async archive(taskBoardId: number, actorId: number): Promise<TaskBoard> {
    let taskBoard = await this.getFullTaskBoard(taskBoardId)
    this.verifyArchive(taskBoard)

    taskBoard = await this._archive(taskBoard, actorId)

    await this.nodeService.contentArchived(taskBoardId, this.getNodeType(), actorId)

    return taskBoard
  }

  async nodeArchived(node: Node, actorId: number): Promise<void> {
    const taskBoard = await this.getFullTaskBoard(node.contentId)

    if (!taskBoard) {
      return
    }

    await this._archive(taskBoard, actorId)
  }

  private async _archive(taskBoard: TaskBoard, actorId: number): Promise<TaskBoard> {
    await this.getTaskBoardRepository().softRemove(taskBoard)
    await this.taskListService.boardArchived(taskBoard.id)

    await this.notifyActivity(TaskBoardActivity.archived(taskBoard, actorId))

    return taskBoard
  }

  async restore(taskBoardId: number, actorId: number): Promise<TaskBoard> {
    let taskBoard = await this.getArchivedTaskBoardById(taskBoardId)
    this.verifyRestore(taskBoard)

    taskBoard = await this._restore(taskBoard, actorId)

    await this.nodeService.contentRestored(taskBoardId, this.getNodeType(), actorId)
    return taskBoard
  }

  async nodeRestored(node: Node, actorId: number) {
    const taskBoard = await this.getArchivedTaskBoardById(node.contentId)

    if (!taskBoard) {
      return
    }

    await this._restore(taskBoard, actorId)
  }

  private async _restore(taskBoard: TaskBoard, actorId: number): Promise<TaskBoard> {
    await this.getTaskBoardRepository().recover(taskBoard)
    await this.taskListService.boardRestored(taskBoard.id)

    await this.notifyActivity(TaskBoardActivity.restored(taskBoard, actorId))

    return this.getCompleteTaskBoard(taskBoard.id)
  }

  async remove(id: number, actorId: number) {
    let taskBoard = await this.requireById(id, { withDeleted: true })
    // this.verifyRemove(taskBoard)

    taskBoard = await this._remove(taskBoard, actorId)

    await this.nodeContentMediator.contentRemoved(id, this.getNodeType(), actorId)

    return taskBoard
  }

  async nodeRemoved(node: Node, actorId: number): Promise<void> {
    const taskBoard = await this.getById(node.contentId, { withDeleted: true })

    if (taskBoard) {
      await this._remove(taskBoard, actorId)
    }
  }

  private async _remove(taskBoard: TaskBoard, actorId: number): Promise<TaskBoard> {
    await this.notifyActivity(TaskBoardActivity.deleted(taskBoard, actorId))
    return this.getTaskBoardRepository().remove(taskBoard)
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
}
