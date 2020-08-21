import { createSettingsModule } from '@/store/utils/createSettingsModule'
import { TaskBoardType } from '@/types/resource'

export interface TaskSettings {
  viewAs: TaskBoardType;
  seenViewTip: boolean;
}

const settings = createSettingsModule<TaskSettings>(() => ({
  viewAs: TaskBoardType.Kanban,
  seenViewTip: false
}))

export default settings
