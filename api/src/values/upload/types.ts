import { UploadType } from '../../types/upload'

export interface IUploadAttributes {
  userId: number
  spaceId?: number
  entityId: number
  entity: string
  type: UploadType
}
