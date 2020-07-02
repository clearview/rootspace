export interface ILinkCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly value: string
}

export type ILinkUpdateAttributes = Omit<
  Partial<ILinkCreateAttributes>,
  'userId' | 'spaceId'
>
