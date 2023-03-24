var Formatter = /** @class */ (function () {
    function Formatter(strategy) {
        this.formatter = strategy;
    }
    Formatter.prototype.format = function () {
        return this.formatter.format();
    };
    return Formatter;
}());
export { Formatter };
//# sourceMappingURL=Formatter.js.map