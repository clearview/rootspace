export interface ILinkCreateObject {
  userId: number
  spaceId: number
  title: string
  type: string
  value: string
  parent?: number
}

export interface ILinkUpdateObject {
  title?: string
  value?: string
}
