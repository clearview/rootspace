import { __extends } from "tslib";
import TextFormatter from './TextFormatter';
import { sanitize, ACTIVITIES_LIST } from './utils';
var EmbedFormat = /** @class */ (function (_super) {
    __extends(EmbedFormat, _super);
    function EmbedFormat(resource, userName, userID) {
        var _this = _super.call(this, 'embed', resource, userID) || this;
        _this.data = resource;
        _this.username = userName;
        _this.text = "<span class=\"actor\">".concat(_this.username, "</span>&nbsp;");
        return _this;
    }
    EmbedFormat.prototype.format = function () {
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
    EmbedFormat.prototype.created = function () {
        return this.create();
    };
    EmbedFormat.prototype.updated = function () {
        var text = '';
        var updatedAttributes = this.data.context.updatedAttributes[0];
        if (updatedAttributes === 'title') {
            text += "<span class=\"action\">renamed embed <strong>".concat(sanitize(this.data.context.entity.title), "</strong> to <strong>").concat(sanitize(this.data.context.updatedEntity.title), "</strong></span>");
        }
        else {
            text += "<span class=\"action\">updated embed <strong>".concat(sanitize(this.data.context.entity.title), "</strong>");
        }
        return text;
    };
    EmbedFormat.prototype.deleted = function () {
        return this.delete();
    };
    EmbedFormat.prototype.archived = function () {
        return this.archive();
    };
    EmbedFormat.prototype.restored = function () {
        return this.restore();
    };
    return EmbedFormat;
}(TextFormatter));
export { EmbedFormat };
//# sourceMappingURL=Embed.js.map