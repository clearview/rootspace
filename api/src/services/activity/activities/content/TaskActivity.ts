import { TaskList } from '../../../../database/entities/tasks/TaskList'
import { Task } from '../../../../database/entities/tasks/Task'
import { Tag } from '../../../../database/entities/tasks/Tag'
import { TaskComment } from '../../../../database/entities/tasks/TaskComment'
import { Upload } from '../../../../database/entities/Upload'
import { User } from '../../../../database/entities/User'
import { ContentActivity } from './ContentActivity'
import { ContentActions, TaskActions } from './actions'
import { entityRoomName, RoomEntityName } from '../../../web-socket'

export class TaskActivity extends ContentActivity<Task> {
  constructor(action: string, task: Task, actorId: number) {
    super(action, task, actorId)

    this._entityAttributes = ['id', 'boardId', 'title', 'slug', 'dueDate']
    this._entityUpdateAttributes = ['title', 'slug', 'description', 'dueDate']
  }

  getEntityName(): string {
    return 'Task'
  }

  handler(): string {
    return 'TaskActivityHandler'
  }

  push(): boolean {
    return true
  }

  pushTo(): string {
    return entityRoomName(this._entity.spaceId, RoomEntityName.TaskBoard, this._entity.boardId)
  }

  static created(entity: Task, actorId: number): TaskActivity {
    return new TaskActivity(ContentActions.Created, entity, actorId).created()
  }

  static updated(entity: Task, updatedEntity: Task, actorId: number) {
    return new TaskActivity(ContentActions.Updated, entity, actorId).updated(updatedEntity)
  }

  static archived(entity: Task, actorId: number): TaskActivity {
    return new TaskActivity(ContentActions.Archived, entity, actorId).archived()
  }

  static restored(entity: Task, actorId: number): TaskActivity {
    return new TaskActivity(ContentActions.Restored, entity, actorId).restored()
  }

  static deleted(entity: Task, actorId: number): TaskActivity {
    return new TaskActivity(ContentActions.Deleted, entity, actorId).deleted()
  }

  static listMoved(entity: Task, fromList: TaskList, toList: TaskList, actorId: number) {
    const activity = new TaskActivity(TaskActions.List_Moved, entity, actorId)

    activity._context = {
      entity: activity._filterEntityAttributes(activity._entity, activity._entityAttributes),
      fromList: {
        title: fromList.title,
      },
      toList: {
        title: toList.title,
      },
    }

    return activity
  }

  static CommentCreated(entity: Task, comment: TaskComment, actorId: number) {
    const activity = new TaskActivity(TaskActions.Comment_Created, entity, actorId)

    activity._context = {
      entity: activity._filterEntityAttributes(activity._entity, activity._entityAttributes),
      comment: {
        id: comment.id,
      },
    }

    return activity
  }

  static AssigneeAdded(entity: Task, assignee: User, actorId: number) {
    return new TaskActivity(TaskActions.Assignee_Added, entity, actorId).createAssigneeContext(assignee)
  }

  static AssigneeRemoved(entity: Task, assignee: User, actorId: number) {
    return new TaskActivity(TaskActions.Assignee_Removed, entity, actorId).createAssigneeContext(assignee)
  }

  static TagAdded(entity: Task, tag: Tag, actorId: number) {
    return new TaskActivity(TaskActions.Tag_Added, entity, actorId).createTagContext(tag)
  }

  static TagRemoved(entity: Task, tag: Tag, actorId: number) {
    return new TaskActivity(TaskActions.Tag_Removed, entity, actorId).createTagContext(tag)
  }

  static attachmentAdded(entity: Task, upload: Upload, actorId: number) {
    return new TaskActivity(TaskActions.Attachment_Added, entity, actorId).createAttachmentContext(upload)
  }

  static attachmentRemoved(entity: Task, upload: Upload, actorId: number) {
    return new TaskActivity(TaskActions.Attachment_Removed, entity, actorId).createAttachmentContext(upload)
  }

  private createAssigneeContext(assignee: User) {
    this._context = {
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
      assignee: {
        id: assignee.id,
        email: assignee.email,
        firstName: assignee.firstName,
        lastName: assignee.lastName,
        fullName: assignee.firstName + ' ' + assignee.lastName,
      },
    }

    return this
  }

  private createTagContext(tag: Tag) {
    this._context = {
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
      tag: {
        label: tag.label,
      },
    }

    return this
  }

  private createAttachmentContext(upload: Upload) {
    this._context = {
      entity: this._filterEntityAttributes(this._entity, this._entityAttributes),
      attachment: {
        id: upload.id,
        filename: upload.filename,
      },
    }

    return this
  }
}
