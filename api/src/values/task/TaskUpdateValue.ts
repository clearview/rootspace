import { ITaskUpdateAttributes } from './types'

export class TaskUpdateValue {
  private readonly attributes: ITaskUpdateAttributes = {
    assignedTo: undefined,
    title: undefined,
    description: undefined,
    status: undefined,
    tags: undefined,
    attachments: undefined,
    dueDate: undefined,
    order: undefined
  }

  private constructor(
      assignedTo?: object,
      title?: string,
      description?: string,
      status?: number,
      tags?: object,
      attachments?: object,
      dueDate?: string,
      order?: number
) {
    this.attributes = {
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

  getAttributes(filiterUndefined: boolean = true): ITaskUpdateAttributes {
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

  static fromObject(data: ITaskUpdateAttributes) {
    return new TaskUpdateValue(
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
}
