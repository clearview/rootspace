import sanitizeHtml from 'sanitize-html'
import { formatDueDate } from '@/utils/date'
import { ActivityResource } from '@/types/resource'

const sanitizeOpt = {
  allowedTags: [],
  allowedAttributes: {}
}

export const ACTIVITIES_LIST = {
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
  UploadFile: 'Upload_File',
  DeleteFile: 'Delete_File',
  RenameFile: 'Rename_File',

  // Access activities
  Public: 'Set_Public',
  Private: 'Set_Private',
  Open: 'Set_Open',
  Restricted: 'Set_Restricted'
}

export const sanitize = (text: string) => {
  return sanitizeHtml(text, sanitizeOpt)
}

export const formatDueDateLocal = (date: Date | string) => {
  const dueDate = date instanceof Date ? date : new Date(date)
  return formatDueDate(dueDate, new Date())
}

export const getContextListOutput = (data: ActivityResource, listName: string, property: string, tag: string, userId?: number) => {
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
