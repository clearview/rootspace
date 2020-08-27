import { UploadType, IUploadImageConfig } from '../../types/upload'

export const UploadUniqueTypes = [UploadType.UserAvatar, UploadType.SpaceLogo]

export const UploadImageConfig: IUploadImageConfig[] = [
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
