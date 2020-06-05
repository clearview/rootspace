import {ITaskCreateAttributes} from './types'

export class TaskCreateValue {
  private readonly attributes: ITaskCreateAttributes = {
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
      listId: string,
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

  get listId(): string {
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

  getAttributes(filiterUndefined: boolean = true): ITaskCreateAttributes {
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

  static fromObject(data: ITaskCreateAttributes) {
    return new TaskCreateValue(
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

  static fromObjectAndUserId(object: ITaskCreateAttributes, userId: number) {
    Object.assign(object, { userId })
    return TaskCreateValue.fromObject(object)
  }
}
