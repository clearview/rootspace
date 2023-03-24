import { __spreadArray } from "tslib";
import sanitizeHtml from 'sanitize-html';
import { formatDueDate } from '@/utils/date';
var sanitizeOpt = {
    allowedTags: [],
    allowedAttributes: {}
};
export var ACTIVITIES_LIST = {
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
export var sanitize = function (text) {
    return sanitizeHtml(text, sanitizeOpt);
};
export var formatDueDateLocal = function (date) {
    var dueDate = date instanceof Date ? date : new Date(date);
    return formatDueDate(dueDate, new Date());
};
export var getContextListOutput = function (data, listName, property, tag, userId) {
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
};
//# sourceMappingURL=utils.js.map