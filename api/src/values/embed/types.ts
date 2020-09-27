export interface IEmbedCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly type: string
  readonly content: string
  readonly parentId?: number
}

export type IEmbedUpdateAttributes = Omit<
  Partial<IEmbedCreateAttributes>,
  'userId' | 'spaceId'
>
