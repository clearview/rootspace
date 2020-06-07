import {ITaskBoardCreateAttributes} from './types'
import { TaskBoardType} from '../../../entities/TaskBoard'

export class TaskBoardCreateValue {
  private readonly attributes: ITaskBoardCreateAttributes = {
    userId: null,
    spaceId: null,
    type: null,
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
      type: TaskBoardType,
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
      type,
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

  get type(): TaskBoardType {
    return this.attributes.type
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

  getAttributes(filiterUndefined: boolean = true): ITaskBoardCreateAttributes {
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

  static fromObject(data: ITaskBoardCreateAttributes) {
    return new TaskBoardCreateValue(
        data.userId,
        data.spaceId,
        data.type,
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

  static fromObjectAndUserId(object: ITaskBoardCreateAttributes, userId: number) {
    Object.assign(object, { userId })
    return TaskBoardCreateValue.fromObject(object)
  }
}
