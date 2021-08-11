import { ActivityResource, UserResource } from '@/types/resource'
import { formatDueDate } from '@/utils/date'
import sanitizeHtml from 'sanitize-html'

const sanitizeOpt = {
  allowedTags: [],
  allowedAttributes: {}
}

const sanitize = (text: string) => {
  return sanitizeHtml(text, sanitizeOpt)
}

function formatDueDateLocal (date: Date | string) {
  const dueDate = date instanceof Date ? date : new Date(date)
  return formatDueDate(dueDate, new Date())
}

function getContextListOutput (data: ActivityResource, listName: string, property: string, tag: string, userId?: number) {
  if (!data.context || !data.context[listName]) {
    return ''
  }

  const list = [...data.context[listName]]

  if (list.length === 0) {
    return ''
  }
  const lastEntry = list.pop()
  let last = `<${tag}>` + sanitizeHtml(lastEntry[property], sanitizeOpt) + `</${tag}>`
  if (property === 'fullName' && userId && lastEntry.id === userId) {
    last = `<${tag}>You</${tag}>`
  }
  if (list.length === 0) {
    return last
  }

  const entries = []

  for (const item of list) {
    if (property === 'fullName' && userId && item.id === userId) {
      entries.push(`<${tag}>You</${tag}>`)
    } else {
      entries.push(`<${tag}>` + item[property] + `</${tag}>`)
    }
  }

  return entries.join(', ') + ' and ' + last
}

const getDisplayName = (user: UserResource, userId?: number) => {
  if (userId && userId === user.id) {
    return 'You'
  } else {
    return `${sanitize(user.firstName)} ${sanitize(user.lastName)}`
  }
}

export function textFormat (data: ActivityResource, userID?: number) {
  const ACTIVITIES_LIST = {
    Created: 'Created',
    Updated: 'Updated',
    Archived: 'Archived',
    Restored: 'Restored',
    Deleted: 'Deleted',
    AssigneeAdded: 'Assignee_Added',
    AssigneeRemoved: 'Assignee_Removed',
    ListMoved: 'List_Moved',
    CommentCreated: 'Comment_Created',
    // CommentUpdated: 'Comment_Updated',
    // CommentDeleted: 'Comment_Deleted',
    TagAdded: 'Tag_Added',
    TagRemoved: 'Tag_Removed',
    AttachmentAdded: 'Attachment_Added',
    AttachmentRemoved: 'Attachment_Removed',
    // UserActivities
    Signup: 'Signup',
    EmailConfirmed: 'Email_Confirmed',
    Login: 'Login',
    LoginFailed: 'Login_Failed',
    PasswordReset: 'Password_Reset',
    InviteSent: 'Invite_Sent',
    InviteAccepted: 'Invite_Accepted',
    Disabled: 'Disabled',
    RemovedFromSpace: 'Removed_From_Space',
    // FileActivities
    Uploaded: 'Uploaded'
  }

  const userName = getDisplayName(data.actor, userID)

  let text = `<span class="actor">${userName}</span>&nbsp;`
  let name = ''
  let actName = ''

  switch (data.entity) {
    case 'TaskBoard':
      actName = 'task board'
      break

    case 'Doc':
      actName = 'document'
      break

    case 'TaskList':
      actName = 'task list'
      break

    case 'Task':
      actName = 'task'
      break

    case 'Link':
      actName = 'link'
      break

    case 'Embed':
      actName = 'embed'
      break

    case 'Node':
      actName = 'node'
      break

    case 'Folder':
      actName = 'folder'
      break
  }

  if (data.entity === 'TaskBoard' ||
    data.entity === 'Doc' ||
    data.entity === 'TaskList' ||
    (
      data.entity === 'Task' &&
      data.action !== 'Attachment_Added' &&
      data.action !== 'Attachment_Removed'
    ) ||
    data.entity === 'Link' ||
    data.entity === 'Embed' ||
    data.entity === 'Folder'
  ) {
    name = data.context.entity.title.replace(/(^\s+|\s+$)/g, '') || 'Untitled'
  }

  switch (data.action) {
    case ACTIVITIES_LIST.Created:
      if (name) {
        text += `<span class="action">created a new ${actName} <strong>${sanitize(name)}</strong></span>`
      } else {
        text += `<span class="action">created a new ${actName}</span>`
      }
      break

    case ACTIVITIES_LIST.Updated:
      if (data.entity === 'Task') {
        const updatedAttributes = data.context.updatedAttributes[0]
        if (updatedAttributes === 'dueDate') {
          if (data.context.entity.dueDate === null) {
            text += `<span class="action">set the due date for task <strong>${sanitize(data.context.updatedEntity.title)}</strong> to <strong>${formatDueDateLocal(data.context.updatedEntity.dueDate)}</strong></span>`
          } else if (data.context.updatedEntity.dueDate === null) {
            text += `<span class="action">removed due date from task <strong>${sanitize(data.context.updatedEntity.title)}</strong></span>`
          } else {
            text += `<span class="action">updated due date for task <strong>${sanitize(data.context.updatedEntity.title)}</strong> from <strong>${formatDueDateLocal(data.context.entity.dueDate)}</strong> to <strong>${formatDueDateLocal(data.context.updatedEntity.dueDate)}</strong></span>`
          }
        } else if (updatedAttributes === 'title') {
          text += `<span class="action">renamed task <strong>${sanitize(data.context.entity.title)}</strong> to <strong>${sanitize(data.context.updatedEntity.title)}</strong></span>`
        } else if (updatedAttributes === 'description') {
          text += `<span class="action">updated the task description for <strong>${sanitize(data.context.entity.title)}</strong></span>`
        } else {
          text += `<span class="action">updated task <strong>${sanitize(data.context.entity.title)}</strong></span>`
        }
      } else if (data.entity === 'TaskBoard') {
        const updatedAttributes = data.context.updatedAttributes[0]
        if (updatedAttributes === 'title') {
          text += `<span class="action">renamed task board <strong>${sanitize(data.context.entity.title)}</strong> to <strong>${sanitize(data.context.updatedEntity.title)}</strong></span>`
        } else {
          text += `<span class="action">updated task board <strong>${sanitize(data.context.entity.title)}</strong></span>`
        }
      } else if (data.entity === 'Doc') {
        const updatedAttributes = data.context.updatedAttributes[0]
        if (updatedAttributes === 'title') {
          text += `<span class="action">set document title to <strong>${sanitize(data.context.entity.title)}</strong> to <strong>${sanitize(data.context.updatedEntity.title)}</strong></span>`
        } else if (updatedAttributes === 'content') {
          text += `<span class="action">updated the content of document <strong>${sanitize(data.context.entity.title)}</strong></span>`
        } else {
          text += `<span class="action">updated document <strong>${sanitize(data.context.entity.title)}</strong></span>`
        }
      } else if (data.entity === 'Link') {
        const updatedAttributes = data.context.updatedAttributes[0]
        if (updatedAttributes === 'title') {
          text += `<span class="action">renamed link <strong>${sanitize(data.context.entity.title)}</strong> to <strong>${sanitize(data.context.updatedEntity.title)}</strong></span>`
        } else {
          text += `<span class="action">updated link <strong>${sanitize(data.context.entity.title)}</strong>`
        }
      } else if (data.entity === 'Embed') {
        const updatedAttributes = data.context.updatedAttributes[0]
        if (updatedAttributes === 'title') {
          text += `<span class="action">renamed embed <strong>${sanitize(data.context.entity.title)}</strong> to <strong>${sanitize(data.context.updatedEntity.title)}</strong></span>`
        } else {
          text += `<span class="action">updated embed <strong>${sanitize(data.context.entity.title)}</strong>`
        }
      } else if (data.entity === 'TaskList') {
        const updatedAttributes = data.context.updatedAttributes[0]
        if (updatedAttributes === 'title') {
          text += `<span class="action">renamed task list <strong>${sanitize(data.context.entity.title)}</strong> to <strong>${sanitize(data.context.updatedEntity.title)}</strong></span>`
        } else {
          text += `<span class="action">updated task list <strong>${sanitize(data.context.entity.title)}</strong>`
        }
      } else if (data.entity === 'Folder') {
        const updatedAttributes = data.context.updatedAttributes[0]
        if (updatedAttributes === 'title') {
          text += `<span class="action">renamed folder <strong>${sanitize(data.context.entity.title)}</strong> to <strong>${sanitize(data.context.updatedEntity.title)}</strong></span>`
        } else {
          text += `<span class="action">updated folder <strong>${sanitize(data.context.entity.title)}</strong>`
        }
      } else {
        text += `<span class="action">updated ${actName} <strong>${sanitize(data.context.entity.title)}</strong></span>`
      }
      break

    case ACTIVITIES_LIST.Archived:
      text += `<span class="action">archived ${actName} <strong>${name}</strong></span>`
      break

    case ACTIVITIES_LIST.Restored:
      text += `<span class="action">restored ${actName} <strong>${name}</strong></span>`
      break

    case ACTIVITIES_LIST.Deleted:
      text += `<span class="action">deleted ${actName} <strong>${name}</strong></span>`
      break

    case ACTIVITIES_LIST.ListMoved:
      text += `<span class="action">moved task <strong>${sanitize(data.context.entity.title)}</strong> from <strong>${sanitize(data.context.fromList.title)}</strong> to <strong>${sanitize(data.context.toList.title)}</strong></span>`
      break

    case ACTIVITIES_LIST.AssigneeAdded:
      text += `<span class="action">added ${getContextListOutput(data, 'assignee', 'fullName', 'strong', userID)} to <strong>${sanitize(data.context.entity.title)}</strong></span>`
      break

    case ACTIVITIES_LIST.AssigneeRemoved:
      text += `<span class="action">removed ${getContextListOutput(data, 'assignee', 'fullName', 'strong', userID)} from <strong>${sanitize(data.context.entity.title)}</strong></span>`
      break

    case ACTIVITIES_LIST.CommentCreated:
      text += `<span class="action">commented on <strong>${sanitize(data.context.entity.title)}</strong></span>`
      break

      // case ACTIVITIES_LIST.CommentUpdated:
      //   text += `<span class="action">updated a comment on <strong>${sanitize(data.context.task.title)}</strong> - ${sanitizeHtml(data.entityId}</span>`
      //   break

      // case ACTIVITIES_LIST.CommentDeleted:
      //   text += `<span class="action">removed a comment on <strong>${sanitize(data.context.task.title)}</strong> - ${sanitizeHtml(data.entityId}</span>`
      //   break

    case ACTIVITIES_LIST.TagAdded:
      text += `<span class="action">tagged <strong>${sanitize(data.context.entity.title)}</strong> with ${getContextListOutput(data, 'tag', 'label', 'strong')}</span>`
      break

    case ACTIVITIES_LIST.TagRemoved:
      text += `<span class="action">removed tag ${getContextListOutput(data, 'tag', 'label', 'strong')} from <strong>${sanitize(data.context.entity.title)}</strong></span>`
      break

    case ACTIVITIES_LIST.AttachmentAdded:
      text += `<span class="action">added an attachment ${getContextListOutput(data, 'attachment', 'filename', 'strong')} to <strong>${sanitize(data.context.entity.title)}</span>`
      break

    case ACTIVITIES_LIST.AttachmentRemoved:
      text += `<span class="action">removed an attachment ${getContextListOutput(data, 'attachment', 'filename', 'strong')} from <strong>${sanitize(data.context.entity.title)}</span>`
      break

      // case ACTIVITIES_LIST.Signup:
      //   break

      // case ACTIVITIES_LIST.EmailConfirmed:
      //   break

      // case ACTIVITIES_LIST.Login:
      //   break

      // case ACTIVITIES_LIST.LoginFailed:
      //   break

      // case ACTIVITIES_LIST.PasswordReset:
      //   break

    case ACTIVITIES_LIST.InviteSent:
      text += '<span class="action">invited an email to this space</span>'
      // text += '<span class="action">invited <strong>[INVITED EMAIL]</strong> to <strong>space: [NAME SPACE]</strong></span>'
      break

    case ACTIVITIES_LIST.InviteAccepted:
      text += '<span class="action">approved the invitation to this space</span>'
      break

      // case ACTIVITIES_LIST.Disabled:
      //   break

    case ACTIVITIES_LIST.RemovedFromSpace:
      text += '<span class="action">removed an email to this space</span>'
      // text += '<span class="action">removed <strong>[REMOVED EMAIL]</strong> from <strong>space: [NAME SPACE]</strong></span>'
      break

      // case ACTIVITIES_LIST.Uploaded:
      //   break

    default:
      break
  }

  return {
    actor: data.actor,
    text: text,
    createdAt: data.createdAt
  }
}

export default textFormat
