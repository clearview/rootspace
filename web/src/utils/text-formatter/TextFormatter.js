import { sanitize } from './utils';
var TextFormatter = /** @class */ (function () {
    function TextFormatter(action, resource, userID) {
        this.action = action;
        this.title = resource.context.entity.title.replace(/(^\s+|\s+$)/g, '') || 'Untitled';
        this.userID = userID;
    }
    TextFormatter.prototype.create = function () {
        var text = "<span class=\"action\">created a new ".concat(this.action);
        if (this.title) {
            text += "<strong>".concat(sanitize(this.title), "</strong>");
        }
        text += '</span>';
        return text;
    };
    TextFormatter.prototype.delete = function () {
        return "<span class=\"action\">deleted ".concat(this.action, " <strong>").concat(this.title, "</strong></span>");
    };
    TextFormatter.prototype.archive = function () {
        return "<span class=\"action\">archived ".concat(this.action, " <strong>").concat(this.title, "</strong></span>");
    };
    TextFormatter.prototype.restore = function () {
        return "<span class=\"action\">restored ".concat(this.action, " <strong>").concat(this.title, "</strong></span>");
    };
    TextFormatter.prototype.update = function () {
        return "<span class=\"action\">updated ".concat(this.action, " <strong>").concat(sanitize(this.title), "</strong></span>");
    };
    return TextFormatter;
}());
export default TextFormatter;
//# sourceMappingURL=TextFormatter.js.map