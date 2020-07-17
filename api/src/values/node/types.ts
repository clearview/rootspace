export interface INodeCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly contentId: number
  readonly title: string
  readonly type: string
}

export type INodeUpdateAttributes = Pick<
  Partial<INodeCreateAttributes>,
  'title'
>
