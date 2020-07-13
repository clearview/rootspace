export interface IDocCreateAttributes {
  userId: number
  spaceId: number
  title: string
  content: object
  access: number
  isLocked: boolean
}

export type IDocUpdateAttributes = Omit<
  Partial<IDocCreateAttributes>,
  'userId' | 'spaceId'
>
