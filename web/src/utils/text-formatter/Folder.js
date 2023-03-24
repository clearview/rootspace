import { __extends } from "tslib";
import TextFormatter from './TextFormatter';
import { sanitize, ACTIVITIES_LIST } from './utils';
var FolderFormat = /** @class */ (function (_super) {
    __extends(FolderFormat, _super);
    function FolderFormat(resource, userName, userID) {
        var _this = _super.call(this, 'folder', resource, userID) || this;
        _this.data = resource;
        _this.username = userName;
        _this.text = "<span class=\"actor\">".concat(_this.username, "</span>&nbsp;");
        return _this;
    }
    FolderFormat.prototype.format = function () {
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
            default:
                console.error('Cannot determine activities action');
                return '';
        }
    };
    FolderFormat.prototype.created = function () {
        return this.create();
    };
    FolderFormat.prototype.updated = function () {
        var text = '';
        var updatedAttributes = this.data.context.updatedAttributes[0];
        if (updatedAttributes === 'title') {
            text += "<span class=\"action\">renamed folder <strong>".concat(sanitize(this.data.context.entity.title), "</strong> to <strong>").concat(sanitize(this.data.context.updatedEntity.title), "</strong></span>");
        }
        else {
            text += "<span class=\"action\">updated folder <strong>".concat(sanitize(this.data.context.entity.title), "</strong>");
        }
        return text;
    };
    FolderFormat.prototype.deleted = function () {
        return this.delete();
    };
    FolderFormat.prototype.archived = function () {
        return this.archive();
    };
    FolderFormat.prototype.restored = function () {
        return this.restore();
    };
    return FolderFormat;
}(TextFormatter));
export { FolderFormat };
//# sourceMappingURL=Folder.js.map