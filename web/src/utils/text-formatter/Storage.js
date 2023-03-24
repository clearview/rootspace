import { __extends } from "tslib";
import TextFormatter from './TextFormatter';
import { ACTIVITIES_LIST } from './utils';
var StorageFormat = /** @class */ (function (_super) {
    __extends(StorageFormat, _super);
    function StorageFormat(resource, userName, userID) {
        var _this = _super.call(this, 'storage', resource, userID) || this;
        _this.data = resource;
        _this.username = userName;
        _this.text = "<span class=\"actor\">".concat(_this.username, "</span>&nbsp;");
        return _this;
    }
    StorageFormat.prototype.format = function () {
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
            case ACTIVITIES_LIST.UploadFile:
                this.title = this.data.context.filename;
                return this.text + this.uploadFile(this.title);
            case ACTIVITIES_LIST.DeleteFile: {
                var oldName = this.data.context.filename;
                var ext = oldName.split('.')[1];
                this.title = "".concat(this.data.context.file.name, ".").concat(ext);
                return this.text + this.deleteFile(this.title);
            }
            case ACTIVITIES_LIST.RenameFile: {
                this.title = this.data.context.fromName;
                var ext = this.title.split('.')[1];
                var toName = "".concat(this.data.context.toName, ".").concat(ext);
                return this.text + this.renameFile(this.title, toName);
            }
            default:
                console.error('Cannot determine activities action');
                return '';
        }
    };
    StorageFormat.prototype.created = function () {
        return this.create();
    };
    StorageFormat.prototype.updated = function () {
        return this.update();
    };
    StorageFormat.prototype.deleted = function () {
        return this.delete();
    };
    StorageFormat.prototype.archived = function () {
        return this.archive();
    };
    StorageFormat.prototype.restored = function () {
        return this.restore();
    };
    StorageFormat.prototype.uploadFile = function (title) {
        return "<span class=\"action\">uploaded a file <strong>".concat(title, "</strong></span>");
    };
    StorageFormat.prototype.deleteFile = function (title) {
        return "<span class=\"action\">deleted a file <strong>".concat(title, "</strong></span>");
    };
    StorageFormat.prototype.renameFile = function (title, toName) {
        return "<span class=\"action\">renamed a file from <strong>".concat(title, "</strong> to <strong>").concat(toName, "</strong></span>");
    };
    return StorageFormat;
}(TextFormatter));
export { StorageFormat };
//# sourceMappingURL=Storage.js.map