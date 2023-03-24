import 'dotenv/config'
import { config } from 'node-config-ts'
import { User } from '../../../../database/entities/User'
import { Task } from '../../../../database/entities/tasks/Task'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './ContentActivityData'
import { ContentActions, TaskActions } from './actions'
import { TaskCommentService } from '../../../'
import { ServiceFactory } from '../../../factory/ServiceFactory'

export class TaskActivityHandler extends ContentActivityHandler<Task> {
  private taskCommentService: TaskCommentService

  private constructor(data: IContentActivityData) {
    super(data)
    this.taskCommentService = ServiceFactory.getInstance().getTaskCommentService()
  }

  async process(): Promise<void> {
    await this.init()

    if (this.activity.action === TaskActions.Assignee_Removed) {
      await this.processNotifications()
      await this.processAction()

      return
    }

    await this.processAction()
    await this.processNotifications()
  }

  private async processAction() {
    switch (this.activity.action) {
      case ContentActions.Created:
        await this.createFollows()
        break
      case ContentActions.Deleted:
        this.removeFollows()
        break
      case TaskActions.Assignee_Added:
        await this.assigneeAdded()
        break
      case TaskActions.Assignee_Removed:
        await this.assigneeRemoved()
        break
    }
  }

  private async processNotifications(): Promise<void> {
    if (this.activity.action === ContentActions.Deleted) {
      return
    }

    await this.createNotificationEntries()
    await this.sendEmailNotifications()
  }

  private async assigneeAdded() {
    const context: any = this.activity.context
    const assigneeId = context.assignee.id

    await this.followService.followEntity(assigneeId, this.entity)
  }

  private async assigneeRemoved() {
    const context: any = this.activity.context
    const assigneeId = context.assignee.id

    await this.followService.unfollowEntity(assigneeId, this.entity)
  }

  private async sendEmailNotifications(): Promise<void> {
    const entityUrl = `${config.domain}/taskboard/${this.entity.boardId}/item/${this.entity.id}/${this.entity.slug}`
    const follows = await this.followService.getFollowsForActivity(this.activity)

    for (const follow of follows) {
      if ((await this.userEmailNotifications(follow.userId)) === true) {
        const user = await this.userService.getUserById(follow.userId)
        const subject = this.getSubjectMessage(user)
        const content = await this.getNotificationContent()

        await this.sendNotificationEmail(user, subject, this.activity, entityUrl, content)
      }
    }
  }

  private getSubjectMessage(user: User): string {
    const actor = this.activity.actor
    const context = this.activity.context as any
    const title = context.entity.title

    if (this.activity.action === TaskActions.Assignee_Added && user.id === context.assignee.id) {
      return `${actor.fullName()} assigned you to task ${title}`
    }

    if (this.activity.action === TaskActions.Assignee_Removed && user.id === context.assignee.id) {
      return `${actor.fullName()} removed you from task ${title}`
    }

    const messages = {
      [ContentActions.Created]: `${actor.fullName()} created task ${title}`,
      [ContentActions.Updated]: `${actor.fullName()} updated task ${title}`,
      [ContentActions.Archived]: `${actor.fullName()} archived task ${title}`,
      [ContentActions.Restored]: `${actor.fullName()} restored task ${title}`,
      [ContentActions.Deleted]: `${actor.fullName()} deleted task ${title}`,
      [TaskActions.List_Moved]: `${actor.fullName()} moved task ${title} from '${context.fromList?.title}' to '${
        context.toList?.title
      }'`,
      [TaskActions.Comment_Created]: `${actor.fullName()} commented on task ${title}`,
      [TaskActions.Assignee_Added]: `${actor.fullName()} assigned ${context.assignee?.fullName ??
        ''} to task ${title}`,
      [TaskActions.Assignee_Removed]: `${actor.fullName()} removed ${context.assignee?.fullName ??
        ''} from task ${title}`,
      [TaskActions.Tag_Added]: `${actor.fullName()} added tag ${context.tag?.label} to task ${title}`,
      [TaskActions.Tag_Removed]: `${actor.fullName()} removed tag ${context.tag?.label} from task ${title}`,
    }

    if (messages.hasOwnProperty(this.activity.action)) {
      return messages[this.activity.action]
    }

    return `${actor.fullName()} updated task ${title}`
  }

  private async getNotificationContent(): Promise<string|null> {
    if (this.activity.action === TaskActions.Comment_Created) {
      const context = this.activity.context as any
      const commentId = context.comment.id
      const comment = await this.taskCommentService.getById(commentId)

      return comment.content
    }

    return null
  }
}
