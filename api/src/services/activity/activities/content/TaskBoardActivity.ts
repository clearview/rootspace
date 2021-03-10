import { TaskBoard } from '../../../../database/entities/tasks/TaskBoard'
import { ContentActivity } from './ContentActivity'
import { ContentActions } from './actions'

export class TaskBoardActivity extends ContentActivity<TaskBoard> {
  constructor(action: string, entity: TaskBoard, actorId: number) {
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

  static created(entity: TaskBoard, actorId: number) {
    return new TaskBoardActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: TaskBoard, updatedEntity: TaskBoard, actorId: number) {
    return new TaskBoardActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: TaskBoard, actorId: number) {
    return new TaskBoardActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: TaskBoard, actorId: number) {
    return new TaskBoardActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: TaskBoard, actorId: number) {
    return new TaskBoardActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
