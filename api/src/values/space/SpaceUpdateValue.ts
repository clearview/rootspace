import { ISpaceUpdateAttributes } from './types'

export class SpaceUpdateValue {
  private readonly attributes: ISpaceUpdateAttributes = {
    title: null,
  }

  private constructor(title?: string) {
    this.attributes = {
      title,
    }
  }

  get title(): string {
    return this.attributes.title
  }

  getAttributes(filiterUndefined: boolean = true): ISpaceUpdateAttributes {
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

  static fromObject(data: ISpaceUpdateAttributes): SpaceUpdateValue {
    return new SpaceUpdateValue(data.title)
  }
}
