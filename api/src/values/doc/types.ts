export interface IDocCreateAttributes {
  userId: number
  spaceId: number
  title: string
  content: object
  access: number
}

export type IDocUpdateAttributes = Omit<
  Partial<IDocCreateAttributes>,
  'userId' | 'spaceId'
>
