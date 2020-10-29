import { TaskBoard } from '../../../../database/entities/tasks/TaskBoard'
import { ContentActivity, IContentActivity } from '.'
import { ContentActions } from './actions'

export class TaskBoardActivity extends ContentActivity<TaskBoard> {
  constructor(action: string, entity: TaskBoard, actorId?: number) {
    super(action, entity, actorId)

    this._filterEntityAttributes = ['id', 'title']
    this._notifyUpdatedAttributes = ['id', 'title']

    this._handler = 'TaskBoardActivityHandler'
  }

  getEntityName(): string {
    return 'TaskBoard'
  }

  getTablename(): string {
    return 'task_boards'
  }

  static created(entity: TaskBoard, actorId?: number): IContentActivity {
    return new TaskBoardActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: TaskBoard, updatedEntity: TaskBoard, actorId?: number) {
    return new TaskBoardActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: TaskBoard, actorId?: number): IContentActivity {
    return new TaskBoardActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: TaskBoard, actorId?: number): IContentActivity {
    return new TaskBoardActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: TaskBoard, actorId?: number): IContentActivity {
    return new TaskBoardActivity(ContentActions.Deleted, entity, actorId).deleted()
  }
}
