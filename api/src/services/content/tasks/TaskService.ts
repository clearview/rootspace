import { getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../../../database/repositories/SpaceRepository'
import { TaskBoardRepository } from '../../../database/repositories/tasks/TaskBoardRepository'
import { TaskListRepository } from '../../../database/repositories/tasks/TaskListRepository'
import { TaskRepository } from '../../../database/repositories/tasks/TaskRepository'
import { Task } from '../../../database/entities/tasks/Task'
import { ServiceFactory } from '../../factory/ServiceFactory'
import { Service, UserService, TaskBoardTagService } from '../../'
import { TaskActivity } from '../../activity/activities/content'

export class TaskService extends Service {
  private userService: UserService
  private tagService: TaskBoardTagService

  private constructor() {
    super()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.tagService = ServiceFactory.getInstance().getTaskBoardTagService()
  }

  private static instance: TaskService

  static getInstance() {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService()
    }

    return TaskService.instance
  }

  getSpaceRepository(): SpaceRepository {
    return getCustomRepository(SpaceRepository)
  }

  getTaskBoardRepository(): TaskBoardRepository {
    return getCustomRepository(TaskBoardRepository)
  }

  getTaskListRepository(): TaskListRepository {
    return getCustomRepository(TaskListRepository)
  }

  getTaskRepository(): TaskRepository {
    return getCustomRepository(TaskRepository)
  }

  async getById(id: number): Promise<Task> {
    return this.getTaskRepository().getById(id)
  }

  async getArchivedById(id: number): Promise<Task> {
    return this.getTaskRepository().findOneArchived(id)
  }

  async create(data: any): Promise<Task> {
    data.list = await this.getTaskListRepository().findOneOrFail(data.listId)
    data.board = await this.getTaskBoardRepository().findOneOrFail(data.list.boardId)
    data.space = await this.getSpaceRepository().findOneOrFail(data.board.spaceId)

    const task = await this.getTaskRepository().save(data)
    await this.notifyActivity(TaskActivity.created(task, task.userId))

    await this.assigneesUpdate(task, data)

    return this.getTaskRepository().getById(task.id)
  }

  async update(id: number, data: any, actorId: number): Promise<Task> {
    const task = await this.getById(id)
    let updatedTask = await this.getById(id)

    updatedTask = await this.getTaskRepository().save({
      ...updatedTask,
      ...data,
    })

    updatedTask = await this.getTaskRepository().reload(updatedTask)
    await this.notifyActivity(TaskActivity.updated(task, updatedTask, actorId))

    if (task.listId !== updatedTask.listId) {
      const oldList = await this.getTaskListRepository().findOne(task.listId)
      const newList = await this.getTaskListRepository().findOne(updatedTask.listId)

      this.notifyActivity(TaskActivity.listMoved(updatedTask, oldList, newList, actorId))
    }

    await this.assigneesUpdate(updatedTask, data)

    return this.getTaskRepository().getById(updatedTask.id)
  }

  async archive(taskId: number, actorId: number): Promise<Task | undefined> {
    const task = await this.getTaskRepository().findOneArchived(taskId)

    if (task) {
      await this.notifyActivity(TaskActivity.archived(task, actorId))
      return this.getTaskRepository().softRemove(task)
    }

    return null
  }

  async listArchived(taskListId: number): Promise<void> {
    const tasks = await this.getTaskRepository().getByListId(taskListId)

    for (const task of tasks) {
      await this.getTaskRepository().softRemove(task)
    }
  }

  async restore(taskId: number, actorId: number): Promise<Task> {
    const task = await this.getTaskRepository().findOneArchived(taskId)

    const recoveredTask = await this.getTaskRepository().recover(task)
    await this.notifyActivity(TaskActivity.restored(task, actorId))

    return recoveredTask
  }

  async listRestored(taskListId: number): Promise<void> {
    const tasks = await this.getTaskRepository().getByListId(taskListId, { withDeleted: true })

    for (const task of tasks) {
      await this.getTaskRepository().recover(task)
    }
  }

  async remove(taskId: number, actorId: number) {
    const task = await this.getTaskRepository().findOneOrFail(taskId, { withDeleted: true })

    await this.notifyActivity(TaskActivity.deleted(task, actorId))
    return this.getTaskRepository().remove(task)
  }

  async assigneesUpdate(task: Task, data: any): Promise<Task> {
    if (!data.assignees) {
      return task
    }

    const assignees = []

    for (const userId of data.assignees) {
      const user = await this.userService.getUserById(userId)
      assignees.push(user)
    }

    task.assignees = assignees

    return this.getTaskRepository().save(task)
  }

  async assigneeAdd(taskId: number, userId: number, actorId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const user = await this.userService.getUserById(userId)

    if (!task.assignees.includes(user)) {
      const assignees = task.assignees
      assignees.push(user)
      task.assignees = assignees

      const savedTask = await this.getTaskRepository().save(task)
      await this.notifyActivity(TaskActivity.AssigneeAdded(savedTask, user, actorId))

      return savedTask
    }

    return task
  }

  async assigneeRemove(taskId: number, userId: number, actorId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const user = await this.userService.getUserById(userId)

    task.assignees = task.assignees.filter((assignee) => {
      return assignee.id !== user.id
    })

    const savedTask = await this.getTaskRepository().save(task)
    await this.notifyActivity(TaskActivity.AssigneeRemoved(savedTask, user, actorId))

    return savedTask
  }

  async tagAdd(taskId: number, tagId: number, actorId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const boardTag = await this.tagService.getById(tagId)

    if (!task.tags.includes(boardTag)) {
      const tags = task.tags
      tags.push(boardTag)
      task.tags = tags

      const savedTask = await this.getTaskRepository().save(task)
      await this.notifyActivity(TaskActivity.TagAdded(savedTask, boardTag, actorId))

      return savedTask
    }

    return task
  }

  async tagRemove(taskId: number, tagId: number, actorId: number): Promise<Task> {
    const task = await this.getById(taskId)
    const boardTag = await this.tagService.getById(tagId)

    task.tags = task.tags.filter((tag) => {
      return tag.id !== boardTag.id
    })

    const savedTask = await this.getTaskRepository().save(task)
    await this.notifyActivity(TaskActivity.TagRemoved(savedTask, boardTag, actorId))

    return savedTask
  }
}
