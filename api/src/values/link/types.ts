export interface ILinkCreateAttributes {
  userId: number
  spaceId: number
  title: string
  type: string
  value: string
  parent?: number
}

export interface ILinkUpdateAttributes {
  title?: string
  value?: string
}
