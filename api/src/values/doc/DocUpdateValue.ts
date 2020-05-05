export interface IDocUpdateObject {
  title?: string
  content?: string
  access?: number
}

export class DocUpdateValue {
  private readonly props: IDocUpdateObject = {
    title: null,
    content: null,
    access: null,
  }

  constructor(
    title: string = null,
    content: string = null,
    access: number = null
  ) {
    this.props = {
      title,
      content,
      access,
    }
  }

  get title(): string {
    return this.props.title
  }

  get content(): string {
    return this.props.content
  }

  get access(): number {
    return this.props.access
  }

  toObject(filiterEmpty: boolean = true): IDocUpdateObject {
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

  static fromObject(data: IDocUpdateObject) {
    return new DocUpdateValue(data.title, data.content, data.access)
  }
}
