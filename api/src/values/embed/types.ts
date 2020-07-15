export interface IEmbedCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly content: string
}

export type IEmbedUpdateAttributes = Omit<
  Partial<IEmbedCreateAttributes>,
  'userId' | 'spaceId'
>
