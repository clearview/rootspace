import { UploadImageConfigType } from './types'
import { UploadEntity } from './UploadEntity'
import { UploadType } from './UploadType'

export const UploadUniqueTypes = [UploadType.UserAvatar, UploadType.SpaceLogo]

export const UploadImageConfig: UploadImageConfigType[] = [
  {
    type: UploadType.UserAvatar,
    sizes: [
      {
        name: 'default',
        width: 110,
        height: 110,
      },
    ],
  },
  {
    type: UploadType.SpaceLogo,
    sizes: [
      {
        name: 'default',
        width: 64,
        height: 64,
      },
    ],
  },
  {
    type: UploadType.TaskAttachment,
    sizes: [
      {
        name: 'thumbnail',
        width: 80,
        height: 64,
      },
      {
        name: 'preview',
        width: 1024,
        height: null,
      },
    ],
  },
]

export const UploadTypeEntityMap = new Map<string, string>([
  [UploadType.UserAvatar, UploadEntity.User],
  [UploadType.SpaceLogo, UploadEntity.Space],
  [UploadType.TaskAttachment, UploadEntity.Task],
  [UploadType.DocContent, UploadEntity.Doc],
  [UploadType.Storage, UploadEntity.Storage],
])
