import { __extends } from "tslib";
import TextFormatter from './TextFormatter';
import { sanitize, ACTIVITIES_LIST } from './utils';
var DocFormat = /** @class */ (function (_super) {
    __extends(DocFormat, _super);
    function DocFormat(resource, userName, userID) {
        var _this = _super.call(this, 'document', resource, userID) || this;
        _this.data = resource;
        _this.username = userName;
        _this.text = "<span class=\"actor\">".concat(_this.username, "</span>&nbsp;");
        return _this;
    }
    DocFormat.prototype.format = function () {
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
            case ACTIVITIES_LIST.Open:
            case ACTIVITIES_LIST.Restricted:
                return this.text + this.openOrRestricted();
            case ACTIVITIES_LIST.Public:
            case ACTIVITIES_LIST.Private:
                return this.text + this.publicOrPrivate();
            default:
                console.error('Cannot determine activities action');
                return '';
        }
    };
    DocFormat.prototype.created = function () {
        return this.create();
    };
    DocFormat.prototype.updated = function () {
        var text = '';
        var updatedAttributes = this.data.context.updatedAttributes[0];
        if (updatedAttributes === 'title') {
            var updatedTitle = this.data.context.updatedEntity.title;
            var title = updatedTitle.trim().length === 0 ? 'Untitled' : updatedTitle;
            text += "<span class=\"action\">set document title to <strong>".concat(sanitize(title), "</strong></span>");
        }
        else if (updatedAttributes === 'content') {
            text += "<span class=\"action\">updated the content of document <strong>".concat(sanitize(this.data.context.entity.title), "</strong></span>");
        }
        else {
            text += "<span class=\"action\">updated document <strong>".concat(sanitize(this.data.context.entity.title), "</strong></span>");
        }
        return text;
    };
    DocFormat.prototype.deleted = function () {
        return this.delete();
    };
    DocFormat.prototype.archived = function () {
        return this.archive();
    };
    DocFormat.prototype.restored = function () {
        return this.restore();
    };
    DocFormat.prototype.openOrRestricted = function () {
        var type = this.data.context.access.type;
        return "<span class=\"action\">change ".concat(this.action, " <strong>").concat(sanitize(this.title), "</strong> access to <strong>").concat(type, "</strong></span>");
    };
    DocFormat.prototype.publicOrPrivate = function () {
        var type = this.data.context.access.public ? 'public' : 'private';
        return "<span class=\"action\">change ".concat(this.action, " <strong>").concat(sanitize(this.title), "</strong> access to <strong>").concat(type, "</strong></span>");
    };
    return DocFormat;
}(TextFormatter));
export { DocFormat };
//# sourceMappingURL=Doc.js.map