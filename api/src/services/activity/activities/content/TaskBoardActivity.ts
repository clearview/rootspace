import { TaskBoard } from '../../../../database/entities/tasks/TaskBoard'
import { ContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class TaskBoardActivity extends ContentActivity<TaskBoard> {
  constructor(action: string, entity: TaskBoard, actorId?: number) {
    super(action, entity, actorId)

    this._entityAttributes = ['id', 'title']
    this._entityUpdateAttributes = ['id', 'title']
  }

  getEntityName(): string {
    return 'TaskBoard'
  }

  handler(): string {
    return 'TaskBoardActivityHandler'
  }

  static created(entity: TaskBoard, actorId?: number) {
    return new TaskBoardActivity(ContentActions.Created, entity, actorId).contentCreated()
  }

  static updated(entity: TaskBoard, updatedEntity: TaskBoard, actorId?: number) {
    return new TaskBoardActivity(ContentActions.Updated, entity, actorId).contentUpdated(updatedEntity)
  }

  static archived(entity: TaskBoard, actorId?: number) {
    return new TaskBoardActivity(ContentActions.Archived, entity, actorId).contentArchived()
  }

  static restored(entity: TaskBoard, actorId?: number) {
    return new TaskBoardActivity(ContentActions.Restored, entity, actorId).contentRestored()
  }

  static deleted(entity: TaskBoard, actorId?: number) {
    return new TaskBoardActivity(ContentActions.Deleted, entity, actorId).contentDeleted()
  }
}
