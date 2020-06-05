export interface ILinkCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly title: string
  readonly type: string
  readonly value: string
}

export type ILinkUpdateAttributes = Pick<
  Partial<ILinkCreateAttributes>,
  'title' | 'value'
>
