import { TaskList } from '../../../../database/entities/tasks/TaskList'
import { Task } from '../../../../database/entities/tasks/Task'
import { Tag } from '../../../../database/entities/tasks/Tag'
import { TaskComment } from '../../../../database/entities/tasks/TaskComment'
import { Upload } from '../../../../database/entities/Upload'
import { User } from '../../../../database/entities/User'
import * as Util from '../util'
import { ContentActivity } from './ContentActivity'
import { TaskActions } from './actions'
import { push, persist, handler } from '../activityProperties'
import { entityAttributes, entityUpdateAttributes } from '../entityAttributes'

@push()
@persist()
@handler('TaskActivityHandler')
@entityAttributes(['id', 'boardId', 'title', 'dueDate'])
@entityUpdateAttributes(['title', 'description', 'dueDate'])
export class TaskActivity extends ContentActivity<Task> {
  constructor(task: Task, actorId?: number) {
    super(task, actorId)
  }

  getEntityName(): string {
    return 'Task'
  }

  listMoved(fromList: TaskList, toList: TaskList) {
    this._action = TaskActions.List_Moved

    this._context = {
      entity: Util.filterEntityAttributes<Task>(this._entityObject, this._entityAttributes),
      fromList: {
        title: fromList.title,
      },
      toList: {
        title: toList.title,
      },
    }

    return this
  }

  commentCreated(comment: TaskComment) {
    this._action = TaskActions.Comment_Created

    this._context = {
      entity: Util.filterEntityAttributes<Task>(this._entityObject, this._entityAttributes),
      comment: {
        id: comment.id,
      },
    }

    return this
  }

  assigneeAdded(assignee: User) {
    this._action = TaskActions.Assignee_Added
    this.createAssigneeContext(assignee)
    return this
  }

  assigneeRemoved(assignee: User) {
    this._action = TaskActions.Assignee_Removed
    this.createAssigneeContext(assignee)
    return this
  }

  tagAdded(tag: Tag) {
    this._action = TaskActions.Tag_Added
    this.createTagContext(tag)
    return this
  }

  tagRemoved(tag: Tag) {
    this._action = TaskActions.Tag_Removed
    this.createTagContext(tag)
    return this
  }

  attachmentAdded(upload: Upload) {
    this._action = TaskActions.Attachment_Added
    this.createAttachmentContext(upload)
    return this
  }

  attachmentRemoved(upload: Upload) {
    this._action = TaskActions.Attachment_Removed
    this.createAttachmentContext(upload)
    return this
  }

  private createAssigneeContext(assignee: User) {
    this._context = {
      entity: Util.filterEntityAttributes<Task>(this._entityObject, this._entityAttributes),
      assignee: {
        id: assignee.id,
        email: assignee.email,
        firstName: assignee.firstName,
        lastName: assignee.lastName,
        fullName: assignee.firstName + ' ' + assignee.lastName,
      },
    }
  }

  private createTagContext(tag: Tag) {
    this._context = {
      entity: Util.filterEntityAttributes<Task>(this._entityObject, this._entityAttributes),
      tag: {
        label: tag.label,
      },
    }
  }

  private createAttachmentContext(upload: Upload) {
    this._context = {
      entity: Util.filterEntityAttributes<Task>(this._entityObject, this._entityAttributes),
      attachment: {
        id: upload.id,
        filename: upload.filename,
      },
    }
  }
}
