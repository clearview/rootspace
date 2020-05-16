import { ISpaceCreateAttributes } from './types'

export class SpaceCreateValue {
  private readonly attributes: ISpaceCreateAttributes = {
    userId: null,
    title: null,
  }

  constructor(userId: number, title: string) {
    this.attributes = {
      userId,
      title,
    }
  }

  get userId(): number {
    return this.attributes.userId
  }

  get title(): string {
    return this.attributes.title
  }

  getAttributes(filiterUndefined: boolean = true): ISpaceCreateAttributes {
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

  static fromObject(data: ISpaceCreateAttributes): SpaceCreateValue {
    return new SpaceCreateValue(data.userId, data.title)
  }

  static fromObjectAndUserId(
    data: ISpaceCreateAttributes,
    userId: number
  ): SpaceCreateValue {
    Object.assign(data, { userId })
    return SpaceCreateValue.fromObject(data)
  }
}
