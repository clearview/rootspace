import { __extends } from "tslib";
import TextFormatter from './TextFormatter';
import { sanitize, ACTIVITIES_LIST } from './utils';
var LinkFormat = /** @class */ (function (_super) {
    __extends(LinkFormat, _super);
    function LinkFormat(resource, userName, userID) {
        var _this = _super.call(this, 'link', resource, userID) || this;
        _this.data = resource;
        _this.username = userName;
        _this.text = "<span class=\"actor\">".concat(_this.username, "</span>&nbsp;");
        return _this;
    }
    LinkFormat.prototype.format = function () {
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
    LinkFormat.prototype.created = function () {
        return this.create();
    };
    LinkFormat.prototype.updated = function () {
        var text = '';
        var updatedAttributes = this.data.context.updatedAttributes[0];
        if (updatedAttributes === 'title') {
            text += "<span class=\"action\">renamed link <strong>".concat(sanitize(this.data.context.entity.title), "</strong> to <strong>").concat(sanitize(this.data.context.updatedEntity.title), "</strong></span>");
        }
        else {
            text += "<span class=\"action\">updated link <strong>".concat(sanitize(this.data.context.entity.title), "</strong>");
        }
        return text;
    };
    LinkFormat.prototype.deleted = function () {
        return this.delete();
    };
    LinkFormat.prototype.archived = function () {
        return this.archive();
    };
    LinkFormat.prototype.restored = function () {
        return this.restore();
    };
    return LinkFormat;
}(TextFormatter));
export { LinkFormat };
//# sourceMappingURL=Link.js.map