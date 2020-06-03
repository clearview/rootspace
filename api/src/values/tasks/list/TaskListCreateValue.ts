import {ITaskListCreateAttributes} from './types'

export class TaskListCreateValue {
  private readonly attributes: ITaskListCreateAttributes = {
    userId: null,
    spaceId: null,
    listId: null,
    assignedTo: null,
    title: null,
    description: null,
    status: null,
    tags: null,
    attachments: null,
    dueDate: null,
    order: null
  }

  private constructor(
      userId: number,
      spaceId: number,
      listId: number,
      assignedTo: object,
      title: string,
      description: string,
      status: number,
      tags: object,
      attachments: object,
      dueDate: string,
      order: number
  ) {
    this.attributes = {
      userId,
      spaceId,
      listId,
      assignedTo,
      title,
      description,
      status,
      tags,
      attachments,
      dueDate,
      order
    }
  }

  get userId(): number {
    return this.attributes.userId
  }

  get spaceId(): number {
    return this.attributes.spaceId
  }

  get listId(): number {
    return this.attributes.listId
  }

  get assignedTo(): object {
    return this.attributes.assignedTo
  }

  get title(): string {
    return this.attributes.title
  }

  get description(): string {
    return this.attributes.description
  }

  get status(): number {
    return this.attributes.status
  }

  get tags(): object {
    return this.attributes.tags
  }

  get attachments(): object {
    return this.attributes.attachments
  }

  get dueDate(): string {
    return this.attributes.dueDate
  }

  get order(): number {
    return this.attributes.order
  }

  getAttributes(filiterUndefined: boolean = true): ITaskListCreateAttributes {
    if (filiterUndefined === false) {
      return this.attributes
    }

    const filtered = this.attributes

    for (const key in this.attributes) {
      if (filtered[key] === undefined) {
        delete filtered[key]
      }
    }

    return filtered
  }

  static fromObject(data: ITaskListCreateAttributes) {
    return new TaskListCreateValue(
        data.userId,
        data.spaceId,
        data.listId,
        data.assignedTo,
        data.title,
        data.description,
        data.status,
        data.tags,
        data.attachments,
        data.dueDate,
        data.order
    )
  }

  static fromObjectAndUserId(object: ITaskListCreateAttributes, userId: number) {
    Object.assign(object, { userId })
    return TaskListCreateValue.fromObject(object)
  }
}
