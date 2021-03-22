import { TaskList } from '../../../../database/entities/tasks/TaskList'
import { ContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class TaskListActivity extends ContentActivity<TaskList> {
  constructor(action: string, entity: TaskList, actorId: number) {
    super(action, entity, actorId)

    this._entityAttributes = ['id', 'title']
    this._entityUpdateAttributes = ['title']
  }

  getEntityName(): string {
    return 'TaskList'
  }

  handler(): string {
    return 'TaskListActivityHandler'
  }

  static created(entity: TaskList, actorId: number) {
    return new TaskListActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: TaskList, updatedEntity: TaskList, actorId: number) {
    return new TaskListActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: TaskList, actorId: number) {
    return new TaskListActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: TaskList, actorId: number) {
    return new TaskListActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: TaskList, actorId: number) {
    return new TaskListActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
