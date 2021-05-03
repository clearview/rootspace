import { createSettingsModule } from '@/store/utils/createSettingsModule'
import { FilesViewType } from '@/types/resource'

export interface FileSettings {
  viewAs: Record<number, FilesViewType>;
  seenViewTip: boolean;
}

const settings = createSettingsModule<FileSettings>(() => ({
  viewAs: { },
  seenViewTip: false
}))

export default settings
