import { __spreadArray } from "tslib";
import { formatDueDate } from '@/utils/date';
import sanitizeHtml from 'sanitize-html';
import { DocFormat, EmbedFormat, FolderFormat, Formatter, LinkFormat, StorageFormat, TaskBoardFormat, TaskFormat } from './text-formatter';
var sanitizeOpt = {
    allowedTags: [],
    allowedAttributes: {}
};
var sanitize = function (text) {
    return sanitizeHtml(text, sanitizeOpt);
};
function formatDueDateLocal(date) {
    var dueDate = date instanceof Date ? date : new Date(date);
    return formatDueDate(dueDate, new Date());
}
function getContextListOutput(data, listName, property, tag, userId) {
    if (!data.context || !data.context[listName]) {
        return '';
    }
    var list = __spreadArray([], data.context[listName], true);
    if (list.length === 0) {
        return '';
    }
    var lastEntry = list.pop();
    var last = "<".concat(tag, ">") + sanitizeHtml(lastEntry[property], sanitizeOpt) + "</".concat(tag, ">");
    if (property === 'fullName' && userId && lastEntry.id === userId) {
        last = "<".concat(tag, ">You</").concat(tag, ">");
    }
    if (list.length === 0) {
        return last;
    }
    var entries = [];
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var item = list_1[_i];
        if (property === 'fullName' && userId && item.id === userId) {
            entries.push("<".concat(tag, ">You</").concat(tag, ">"));
        }
        else {
            entries.push("<".concat(tag, ">") + item[property] + "</".concat(tag, ">"));
        }
    }
    return entries.join(', ') + ' and ' + last;
}
var getDisplayName = function (user, userId) {
    if (userId && userId === user.id) {
        return 'You';
    }
    else {
        return "".concat(sanitize(user.firstName), " ").concat(sanitize(user.lastName));
    }
};
export function textFormat(data, userID) {
    var ACTIVITIES_LIST = {
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
    };
    var userName = getDisplayName(data.actor, userID);
    var text = "<span class=\"actor\">".concat(userName, "</span>&nbsp;");
    var name = '';
    var actName = '';
    switch (data.entity) {
        case 'TaskBoard':
            actName = 'task board';
            break;
        case 'Doc':
            actName = 'document';
            break;
        case 'TaskList':
            actName = 'task list';
            break;
        case 'Task':
            actName = 'task';
            break;
        case 'Link':
            actName = 'link';
            break;
        case 'Embed':
            actName = 'embed';
            break;
        case 'Node':
            actName = 'node';
            break;
        case 'Folder':
            actName = 'folder';
            break;
        case 'Storage':
            actName = 'storage';
            break;
    }
    if (data.entity === 'TaskBoard' ||
        data.entity === 'Doc' ||
        data.entity === 'TaskList' ||
        (data.entity === 'Task' &&
            data.action !== 'Attachment_Added' &&
            data.action !== 'Attachment_Removed') ||
        data.entity === 'Link' ||
        data.entity === 'Embed' ||
        data.entity === 'Folder' ||
        data.entity === 'Storage') {
        name = data.context.entity.title.replace(/(^\s+|\s+$)/g, '') || 'Untitled';
    }
    switch (data.action) {
        case ACTIVITIES_LIST.Created:
            if (name) {
                text += "<span class=\"action\">created a new ".concat(actName, " <strong>").concat(sanitize(name), "</strong></span>");
            }
            else {
                text += "<span class=\"action\">created a new ".concat(actName, "</span>");
            }
            break;
        case ACTIVITIES_LIST.Updated:
            if (data.entity === 'Task') {
                var updatedAttributes = data.context.updatedAttributes[0];
                if (updatedAttributes === 'dueDate') {
                    if (data.context.entity.dueDate === null) {
                        text += "<span class=\"action\">set the due date for task <strong>".concat(sanitize(data.context.updatedEntity.title), "</strong> to <strong>").concat(formatDueDateLocal(data.context.updatedEntity.dueDate), "</strong></span>");
                    }
                    else if (data.context.updatedEntity.dueDate === null) {
                        text += "<span class=\"action\">removed due date from task <strong>".concat(sanitize(data.context.updatedEntity.title), "</strong></span>");
                    }
                    else {
                        text += "<span class=\"action\">updated due date for task <strong>".concat(sanitize(data.context.updatedEntity.title), "</strong> from <strong>").concat(formatDueDateLocal(data.context.entity.dueDate), "</strong> to <strong>").concat(formatDueDateLocal(data.context.updatedEntity.dueDate), "</strong></span>");
                    }
                }
                else if (updatedAttributes === 'title') {
                    text += "<span class=\"action\">renamed task <strong>".concat(sanitize(data.context.entity.title), "</strong> to <strong>").concat(sanitize(data.context.updatedEntity.title), "</strong></span>");
                }
                else if (updatedAttributes === 'description') {
                    text += "<span class=\"action\">updated the task description for <strong>".concat(sanitize(data.context.entity.title), "</strong></span>");
                }
                else {
                    text += "<span class=\"action\">updated task <strong>".concat(sanitize(data.context.entity.title), "</strong></span>");
                }
            }
            else if (data.entity === 'TaskBoard') {
                var updatedAttributes = data.context.updatedAttributes[0];
                if (updatedAttributes === 'title') {
                    text += "<span class=\"action\">renamed task board <strong>".concat(sanitize(data.context.entity.title), "</strong> to <strong>").concat(sanitize(data.context.updatedEntity.title), "</strong></span>");
                }
                else {
                    text += "<span class=\"action\">updated task board <strong>".concat(sanitize(data.context.entity.title), "</strong></span>");
                }
            }
            else if (data.entity === 'Doc') {
                var updatedAttributes = data.context.updatedAttributes[0];
                if (updatedAttributes === 'title') {
                    var updatedTitle = data.context.updatedEntity.title;
                    var title = updatedTitle.trim().length === 0 ? 'Untitled' : updatedTitle;
                    text += "<span class=\"action\">set document title to <strong>".concat(sanitize(title), "</strong></span>");
                }
                else if (updatedAttributes === 'content') {
                    text += "<span class=\"action\">updated the content of document <strong>".concat(sanitize(data.context.entity.title), "</strong></span>");
                }
                else {
                    text += "<span class=\"action\">updated document <strong>".concat(sanitize(data.context.entity.title), "</strong></span>");
                }
            }
            else if (data.entity === 'Link') {
                var updatedAttributes = data.context.updatedAttributes[0];
                if (updatedAttributes === 'title') {
                    text += "<span class=\"action\">renamed link <strong>".concat(sanitize(data.context.entity.title), "</strong> to <strong>").concat(sanitize(data.context.updatedEntity.title), "</strong></span>");
                }
                else {
                    text += "<span class=\"action\">updated link <strong>".concat(sanitize(data.context.entity.title), "</strong>");
                }
            }
            else if (data.entity === 'Embed') {
                var updatedAttributes = data.context.updatedAttributes[0];
                if (updatedAttributes === 'title') {
                    text += "<span class=\"action\">renamed embed <strong>".concat(sanitize(data.context.entity.title), "</strong> to <strong>").concat(sanitize(data.context.updatedEntity.title), "</strong></span>");
                }
                else {
                    text += "<span class=\"action\">updated embed <strong>".concat(sanitize(data.context.entity.title), "</strong>");
                }
            }
            else if (data.entity === 'TaskList') {
                var updatedAttributes = data.context.updatedAttributes[0];
                if (updatedAttributes === 'title') {
                    text += "<span class=\"action\">renamed task list <strong>".concat(sanitize(data.context.entity.title), "</strong> to <strong>").concat(sanitize(data.context.updatedEntity.title), "</strong></span>");
                }
                else {
                    text += "<span class=\"action\">updated task list <strong>".concat(sanitize(data.context.entity.title), "</strong>");
                }
            }
            else if (data.entity === 'Folder') {
                var updatedAttributes = data.context.updatedAttributes[0];
                if (updatedAttributes === 'title') {
                    text += "<span class=\"action\">renamed folder <strong>".concat(sanitize(data.context.entity.title), "</strong> to <strong>").concat(sanitize(data.context.updatedEntity.title), "</strong></span>");
                }
                else {
                    text += "<span class=\"action\">updated folder <strong>".concat(sanitize(data.context.entity.title), "</strong>");
                }
            }
            else {
                text += "<span class=\"action\">updated ".concat(actName, " <strong>").concat(sanitize(data.context.entity.title), "</strong></span>");
            }
            break;
        case ACTIVITIES_LIST.Archived:
            text += "<span class=\"action\">archived ".concat(actName, " <strong>").concat(name, "</strong></span>");
            break;
        case ACTIVITIES_LIST.Restored:
            text += "<span class=\"action\">restored ".concat(actName, " <strong>").concat(name, "</strong></span>");
            break;
        case ACTIVITIES_LIST.Deleted:
            text += "<span class=\"action\">deleted ".concat(actName, " <strong>").concat(name, "</strong></span>");
            break;
        case ACTIVITIES_LIST.ListMoved:
            text += "<span class=\"action\">moved task <strong>".concat(sanitize(data.context.entity.title), "</strong> from <strong>").concat(sanitize(data.context.fromList.title), "</strong> to <strong>").concat(sanitize(data.context.toList.title), "</strong></span>");
            break;
        case ACTIVITIES_LIST.AssigneeAdded:
            text += "<span class=\"action\">added ".concat(getContextListOutput(data, 'assignee', 'fullName', 'strong', userID), " to <strong>").concat(sanitize(data.context.entity.title), "</strong></span>");
            break;
        case ACTIVITIES_LIST.AssigneeRemoved:
            text += "<span class=\"action\">removed ".concat(getContextListOutput(data, 'assignee', 'fullName', 'strong', userID), " from <strong>").concat(sanitize(data.context.entity.title), "</strong></span>");
            break;
        case ACTIVITIES_LIST.CommentCreated:
            text += "<span class=\"action\">commented on <strong>".concat(sanitize(data.context.entity.title), "</strong></span>");
            break;
        // case ACTIVITIES_LIST.CommentUpdated:
        //   text += `<span class="action">updated a comment on <strong>${sanitize(data.context.task.title)}</strong> - ${sanitizeHtml(data.entityId}</span>`
        //   break
        // case ACTIVITIES_LIST.CommentDeleted:
        //   text += `<span class="action">removed a comment on <strong>${sanitize(data.context.task.title)}</strong> - ${sanitizeHtml(data.entityId}</span>`
        //   break
        case ACTIVITIES_LIST.TagAdded:
            text += "<span class=\"action\">tagged <strong>".concat(sanitize(data.context.entity.title), "</strong> with ").concat(getContextListOutput(data, 'tag', 'label', 'strong'), "</span>");
            break;
        case ACTIVITIES_LIST.TagRemoved:
            text += "<span class=\"action\">removed tag ".concat(getContextListOutput(data, 'tag', 'label', 'strong'), " from <strong>").concat(sanitize(data.context.entity.title), "</strong></span>");
            break;
        case ACTIVITIES_LIST.AttachmentAdded:
            text += "<span class=\"action\">added an attachment ".concat(getContextListOutput(data, 'attachment', 'filename', 'strong'), " to <strong>").concat(sanitize(data.context.entity.title), "</span>");
            break;
        case ACTIVITIES_LIST.AttachmentRemoved:
            text += "<span class=\"action\">removed an attachment ".concat(getContextListOutput(data, 'attachment', 'filename', 'strong'), " from <strong>").concat(sanitize(data.context.entity.title), "</span>");
            break;
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
            text += '<span class="action">invited an email to this space</span>';
            // text += '<span class="action">invited <strong>[INVITED EMAIL]</strong> to <strong>space: [NAME SPACE]</strong></span>'
            break;
        case ACTIVITIES_LIST.InviteAccepted:
            text += '<span class="action">approved the invitation to this space</span>';
            break;
        // case ACTIVITIES_LIST.Disabled:
        //   break
        case ACTIVITIES_LIST.RemovedFromSpace:
            text += '<span class="action">removed an email to this space</span>';
            // text += '<span class="action">removed <strong>[REMOVED EMAIL]</strong> from <strong>space: [NAME SPACE]</strong></span>'
            break;
        default:
            break;
    }
    var newText = text;
    var formatter;
    if (data.entity === 'Doc') {
        formatter = new Formatter(new DocFormat(data, userName, userID));
    }
    else if (data.entity === 'TaskBoard') {
        formatter = new Formatter(new TaskBoardFormat(data, userName, userID));
    }
    else if (data.entity === 'Task') {
        formatter = new Formatter(new TaskFormat(data, userName, userID));
    }
    else if (data.entity === 'Storage') {
        formatter = new Formatter(new StorageFormat(data, userName, userID));
    }
    else if (data.entity === 'Folder') {
        formatter = new Formatter(new FolderFormat(data, userName, userID));
    }
    else if (data.entity === 'Link') {
        formatter = new Formatter(new LinkFormat(data, userName, userID));
    }
    else if (data.entity === 'Embed') {
        formatter = new Formatter(new EmbedFormat(data, userName, userID));
    }
    if (formatter) {
        newText = formatter.format();
    }
    return {
        actor: data.actor,
        text: newText,
        createdAt: data.createdAt
    };
}
export default textFormat;
//# sourceMappingURL=textFormat.js.map