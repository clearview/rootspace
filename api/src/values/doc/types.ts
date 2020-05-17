export interface IDocCreateAttributes {
  userId: number
  spaceId: number
  title: string
  content: string
  access: number
}

export interface IDocUpdateAttributes {
  title?: string
  content?: string
  access?: number
}
