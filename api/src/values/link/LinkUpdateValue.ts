export interface ILinkUpdateObject {
  title?: string
  value?: string
}

export class LinkUpdateValue {
  private readonly props: ILinkUpdateObject = {
    title: null,
    value: null,
  }

  constructor(title: string, value: string) {
    this.props = {
      title,
      value,
    }
  }

  get title(): string {
    return this.props.title
  }

  get value(): string {
    return this.props.value
  }

  toObject(filiterEmpty: boolean = true): ILinkUpdateObject {
    if (filiterEmpty === false) {
      return this.props
    }

    const filtered = this.props

    for (const key in this.props) {
      if (filtered[key] === undefined) {
        delete filtered[key]
      }
    }

    return filtered
  }

  static fromObject(data: ILinkUpdateObject) {
    return new LinkUpdateValue(data.title, data.value)
  }
}
