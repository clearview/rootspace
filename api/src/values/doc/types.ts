export interface IDocCreateObject {
  userId: number
  spaceId: number
  title: string
  content: string
  access: number
}

export interface IDocUpdateObject {
  title?: string
  content?: string
  access?: number
}
