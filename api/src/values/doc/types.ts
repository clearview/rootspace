export interface IDocCreateAttributes {
  userId: number
  spaceId: number
  title: string
  content: object
  access: number
}

export interface IDocUpdateAttributes {
  title?: string
  content?: object
  access?: number
}
