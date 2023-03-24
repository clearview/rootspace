import { __extends } from "tslib";
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message, fields) {
        var _this = _super.call(this, message.includes('invalid input syntax for type uuid') ? 'The token is invalid' : message) || this;
        _this.fields = [];
        if (fields) {
            _this.fields = fields.map(function (_a) {
                var field = _a.field, validation = _a.validation;
                var label = ValidationError.labels[field];
                var parse = ValidationError.parser[validation];
                return parse(label);
            });
        }
        _this.stack = new Error().stack;
        return _this;
    }
    ValidationError.labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        password: 'Password',
        newPassword: 'New Password',
        newPassword_confirmation: 'New Password Confirmation',
        password_confirmation: 'Password Confirmation' // eslint-disable-line
    };
    ValidationError.parser = {
        dbUnique: function (label) { return "".concat(label, " already exist within the app."); },
        required: function (label) { return "".concat(label, " is required."); },
        accepted: function (label) { return "".concat(label, " is required."); },
        min: function (label) { return "Please use a ".concat(label, " that is at least 8 characters long."); },
        confirmed: function (label) { return "".concat(label, " doesn't match."); },
        compromisedPassword: function (label) { return "This is a commonly used ".concat(label, ", please enter something harder to gues."); }
    };
    return ValidationError;
}(Error));
export { ValidationError };
//# sourceMappingURL=error.js.map