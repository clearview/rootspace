export interface INodeCreateAttributes {
  readonly userId: number
  readonly spaceId: number
  readonly contentId: number
  readonly title: string
  readonly type: string
  readonly config?: Record<string, any>
}

export type INodeUpdateAttributes = Pick<
  Partial<INodeCreateAttributes>,
  'title'
>
