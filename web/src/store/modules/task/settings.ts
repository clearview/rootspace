import { createSettingsModule } from '@/store/utils/createSettingsModule'
import { TaskBoardType } from '@/types/resource'

export interface TaskSettings {
  viewAs: Record<number, TaskBoardType>;
  seenViewTip: boolean;
}

const settings = createSettingsModule<TaskSettings>(() => ({
  viewAs: { },
  seenViewTip: false
}))

export default settings
