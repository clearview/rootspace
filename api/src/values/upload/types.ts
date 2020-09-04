import { UploadType, UploadEntity } from '../../types/upload'

export interface IUploadAttributes {
  userId: number
  spaceId?: number
  entityId: number
  entity: UploadEntity
  type: UploadType
}
