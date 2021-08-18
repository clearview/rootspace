import { ContentAccess } from '../../database/entities/ContentAccess'
import { Doc } from '../../database/entities/Doc'
import { Embed } from '../../database/entities/Embed'
import { Folder } from '../../database/entities/Folder'
import { Link } from '../../database/entities/Link'
import { Storage } from '../../database/entities/Storage'
import { Task } from '../../database/entities/tasks/Task'
import { TaskBoard } from '../../database/entities/tasks/TaskBoard'
import { TaskList } from '../../database/entities/tasks/TaskList'

export type ContentEntity = Link | Folder | Doc | Embed | Storage | TaskBoard | TaskList | Task
