export type NodeCreateAttributes = {
  readonly userId: number
  readonly spaceId: number
  readonly contentId: number
  readonly title: string
  readonly type: string
  readonly config?: Record<string, any>
}

export type NodeUpdateAttributes = Pick<Partial<NodeCreateAttributes>, 'title'>
