import { __extends } from "tslib";
import { Mark } from 'tiptap';
import { alwaysToggleMark } from './TextColor';
var BgColor = /** @class */ (function (_super) {
    __extends(BgColor, _super);
    function BgColor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BgColor.prototype, "name", {
        get: function () {
            return 'bg_color';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BgColor.prototype, "schema", {
        get: function () {
            return {
                attrs: {
                    color: {
                        default: '#000'
                    }
                },
                parseDOM: [
                    {
                        tag: 'span.novadoc-bg-color',
                        getAttrs: function (node) {
                            return {
                                color: node.getAttribute('data-bg-color')
                            };
                        }
                    }
                ],
                toDOM: function (node) { return ['span', {
                        class: 'novadoc-bg-color',
                        style: 'background: ' + node.attrs.color,
                        'data-bg-color': node.attrs.color
                    }, 0]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    BgColor.prototype.commands = function (_a) {
        var type = _a.type;
        return function (attr) {
            return alwaysToggleMark(type, attr);
        };
    };
    return BgColor;
}(Mark));
export default BgColor;
//# sourceMappingURL=BgColor.js.map