export type ContentAccessCreateAttributes = {
  readonly spaceId: number
  readonly ownerId: number
  readonly nodeId: number
  readonly entityId: number
  readonly entity: string
  readonly type: string
  readonly public: boolean
}

export type ContentAccessUpdateAttributes = {
  readonly type: string
  readonly public: boolean
}
