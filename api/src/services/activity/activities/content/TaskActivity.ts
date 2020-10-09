import { TaskList } from '../../../../database/entities/tasks/TaskList'
import { Task } from '../../../../database/entities/tasks/Task'
import { Tag } from '../../../../database/entities/tasks/Tag'
import { User } from '../../../../database/entities/User'
import { ContentActivity, IContentActivity } from '.'
import { ContentActions, TaskActions } from './actions'

export class TaskActivity extends ContentActivity<Task> {
  constructor(action: string, task: Task, actorId?: number) {
    super(action, task, actorId)

    this._filterEntityAttributes = ['id', 'title', 'dueDate']
    this._notifyUpdatedAttributes = ['id', 'title', 'description', 'dueDate']

    this._handler = 'TaskActivityHandler'
  }

  getEntityName(): string {
    return 'Task'
  }

  getTablename(): string {
    return 'tasks'
  }

  static created(task: Task, actorId?: number): IContentActivity {
    return new TaskActivity(ContentActions.Created, task, actorId).created()
  }

  static updated(task: Task, updatedTask: Task, actorId?: number) {
    return new TaskActivity(ContentActions.Updated, task, actorId).updated(updatedTask)
  }

  static archived(task: Task, actorId?: number): IContentActivity {
    return new TaskActivity(ContentActions.Archived, task, actorId).archived()
  }

  static restored(task: Task, actorId?: number): IContentActivity {
    return new TaskActivity(ContentActions.Restored, task, actorId).restored()
  }

  static deleted(task: Task, actorId?: number): IContentActivity {
    return new TaskActivity(ContentActions.Deleted, task, actorId).deleted()
  }

  static listMoved(task: Task, fromList: TaskList, toList: TaskList, actorId?: number) {
    const activity = new TaskActivity(TaskActions.List_Moved, task, actorId)

    activity._context = {
      entity: activity.filterEntityAttributes(activity._entity),
      fromList: {
        title: fromList.title,
      },
      toList: {
        title: toList.title,
      },
    }

    return activity
  }

  static AssigneeAdded(task: Task, assignee: User, actorId?: number): IContentActivity {
    return new TaskActivity(TaskActions.Assignee_Added, task, actorId).createAssigneeContext(assignee)
  }

  static AssigneeRemoved(task: Task, assignee: User, actorId?: number): IContentActivity {
    return new TaskActivity(TaskActions.Assignee_Removed, task, actorId).createAssigneeContext(assignee)
  }

  static TagAdded(task: Task, tag: Tag, actorId?: number): IContentActivity {
    return new TaskActivity(TaskActions.Tag_Added, task, actorId).createTagContext(tag)
  }

  static TagRemoved(task: Task, tag: Tag, actorId?: number): IContentActivity {
    return new TaskActivity(TaskActions.Tag_Removed, task, actorId).createTagContext(tag)
  }

  private createAssigneeContext(assignee: User): IContentActivity {
    this._context = {
      entity: this.filterEntityAttributes(this._entity),
      assignee: {
        id: assignee.id,
        email: assignee.email,
        firstName: assignee.firstName,
        lastName: assignee.lastName,
      },
    }

    return this
  }

  private createTagContext(tag: Tag): IContentActivity {
    this._context = {
      entity: this.filterEntityAttributes(this._entity),
      tag: {
        label: tag.label,
      },
    }

    return this
  }
}
