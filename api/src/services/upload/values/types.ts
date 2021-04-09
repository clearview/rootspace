export type UploadAttributes = {
  userId: number
  spaceId?: number
  entityId: number
  entity: string
  type: string
  name: string
}

export type UploadUpdateAttributes = Pick<Partial<UploadAttributes>, 'name'>
