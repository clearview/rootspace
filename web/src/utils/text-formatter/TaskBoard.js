import { __extends } from "tslib";
import TextFormatter from './TextFormatter';
import { getContextListOutput, sanitize, ACTIVITIES_LIST } from './utils';
var TaskBoardFormat = /** @class */ (function (_super) {
    __extends(TaskBoardFormat, _super);
    function TaskBoardFormat(resource, userName, userID) {
        var _this = _super.call(this, 'task board', resource, userID) || this;
        _this.data = resource;
        _this.username = userName;
        _this.text = "<span class=\"actor\">".concat(_this.username, "</span>&nbsp;");
        return _this;
    }
    TaskBoardFormat.prototype.format = function () {
        switch (this.data.action) {
            case ACTIVITIES_LIST.Created:
                return this.text + this.created();
            case ACTIVITIES_LIST.Updated:
                return this.text + this.updated();
            case ACTIVITIES_LIST.Archived:
                return this.text + this.archived();
            case ACTIVITIES_LIST.Restored:
                return this.text + this.restored();
            case ACTIVITIES_LIST.Deleted:
                return this.text + this.deleted();
            case ACTIVITIES_LIST.ListMoved:
                return this.text + this.listMoved();
            case ACTIVITIES_LIST.AssigneeAdded:
                return this.text + this.assigneeAdded();
            case ACTIVITIES_LIST.AssigneeRemoved:
                return this.text + this.assigneeRemoved();
            case ACTIVITIES_LIST.CommentCreated:
                return this.text + this.commentCreated();
            case ACTIVITIES_LIST.TagAdded:
                return this.text + this.tagAdded();
            case ACTIVITIES_LIST.TagRemoved:
                return this.text + this.tagRemoved();
            case ACTIVITIES_LIST.AttachmentAdded:
                return this.text + this.attachmentAdded();
            case ACTIVITIES_LIST.AttachmentRemoved:
                return this.text + this.attachmentRemoved();
            default:
                console.error('Cannot determine activities action');
                return '';
        }
    };
    TaskBoardFormat.prototype.created = function () {
        return this.create();
    };
    TaskBoardFormat.prototype.updated = function () {
        var text = '';
        var updatedAttributes = this.data.context.updatedAttributes[0];
        if (updatedAttributes === 'title') {
            text += "<span class=\"action\">renamed task board <strong>".concat(sanitize(this.data.context.entity.title), "</strong> to <strong>").concat(sanitize(this.data.context.updatedEntity.title), "</strong></span>");
        }
        else {
            text += "<span class=\"action\">updated task board <strong>".concat(sanitize(this.data.context.entity.title), "</strong></span>");
        }
        return text;
    };
    TaskBoardFormat.prototype.deleted = function () {
        return this.delete();
    };
    TaskBoardFormat.prototype.archived = function () {
        return this.archive();
    };
    TaskBoardFormat.prototype.restored = function () {
        return this.restore();
    };
    TaskBoardFormat.prototype.listMoved = function () {
        return "<span class=\"action\">moved task <strong>".concat(sanitize(this.data.context.entity.title), "</strong> from <strong>").concat(sanitize(this.data.context.fromList.title), "</strong> to <strong>").concat(sanitize(this.data.context.toList.title), "</strong></span>");
    };
    TaskBoardFormat.prototype.assigneeAdded = function () {
        return "<span class=\"action\">added ".concat(getContextListOutput(this.data, 'assignee', 'fullName', 'strong', this.userID), " to <strong>").concat(sanitize(this.data.context.entity.title), "</strong></span>");
    };
    TaskBoardFormat.prototype.assigneeRemoved = function () {
        return "<span class=\"action\">removed ".concat(getContextListOutput(this.data, 'assignee', 'fullName', 'strong', this.userID), " from <strong>").concat(sanitize(this.data.context.entity.title), "</strong></span>");
    };
    TaskBoardFormat.prototype.commentCreated = function () {
        return "<span class=\"action\">commented on <strong>".concat(sanitize(this.data.context.entity.title), "</strong></span>");
    };
    TaskBoardFormat.prototype.tagAdded = function () {
        return "<span class=\"action\">tagged <strong>".concat(sanitize(this.data.context.entity.title), "</strong> with ").concat(getContextListOutput(this.data, 'tag', 'label', 'strong'), "</span>");
    };
    TaskBoardFormat.prototype.tagRemoved = function () {
        return "<span class=\"action\">removed tag ".concat(getContextListOutput(this.data, 'tag', 'label', 'strong'), " from <strong>").concat(sanitize(this.data.context.entity.title), "</strong></span>");
    };
    TaskBoardFormat.prototype.attachmentAdded = function () {
        return "<span class=\"action\">added an attachment ".concat(getContextListOutput(this.data, 'attachment', 'filename', 'strong'), " to <strong>").concat(sanitize(this.data.context.entity.title), "</span>");
    };
    TaskBoardFormat.prototype.attachmentRemoved = function () {
        return "<span class=\"action\">removed an attachment ".concat(getContextListOutput(this.data, 'attachment', 'filename', 'strong'), " from <strong>").concat(sanitize(this.data.context.entity.title), "</span>");
    };
    return TaskBoardFormat;
}(TextFormatter));
export { TaskBoardFormat };
//# sourceMappingURL=TaskBoard.js.map