import { __extends } from "tslib";
import { Mark } from 'tiptap';
export function alwaysToggleMark(markType, attrs) {
    return function (state, dispatch) {
        var ref = state.selection;
        var empty = ref.empty;
        var $cursor = ref.$cursor;
        var ranges = ref.ranges;
        if ((empty && !$cursor)) {
            return false;
        }
        if (dispatch) {
            if ($cursor) {
                if (markType.isInSet(state.storedMarks || $cursor.marks())) {
                    dispatch(state.tr.removeStoredMark(markType).addStoredMark(markType.create(attrs)));
                }
                else {
                    dispatch(state.tr.addStoredMark(markType.create(attrs)));
                }
            }
            else {
                var has = false;
                var tr = state.tr;
                for (var i = 0; !has && i < ranges.length; i++) {
                    var ref$1 = ranges[i];
                    var $from = ref$1.$from;
                    var $to = ref$1.$to;
                    has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
                }
                for (var i$1 = 0; i$1 < ranges.length; i$1++) {
                    var ref$2 = ranges[i$1];
                    var $from$1 = ref$2.$from;
                    var $to$1 = ref$2.$to;
                    if (has) {
                        tr.removeMark($from$1.pos, $to$1.pos, markType)
                            .addMark($from$1.pos, $to$1.pos, markType.create(attrs));
                    }
                    else {
                        tr.addMark($from$1.pos, $to$1.pos, markType.create(attrs));
                    }
                }
                dispatch(tr.scrollIntoView());
            }
        }
        return true;
    };
}
var TextColor = /** @class */ (function (_super) {
    __extends(TextColor, _super);
    function TextColor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TextColor.prototype, "name", {
        get: function () {
            return 'text_color';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextColor.prototype, "schema", {
        get: function () {
            return {
                attrs: {
                    color: {
                        default: '#000'
                    }
                },
                parseDOM: [
                    {
                        tag: 'span.novadoc-text-color',
                        getAttrs: function (node) {
                            return {
                                color: node.getAttribute('data-text-color')
                            };
                        }
                    }
                ],
                toDOM: function (node) { return ['span', {
                        class: 'novadoc-text-color',
                        style: 'color: ' + node.attrs.color,
                        'data-text-color': node.attrs.color
                    }, 0]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    TextColor.prototype.commands = function (_a) {
        var type = _a.type;
        return function (attr) {
            return alwaysToggleMark(type, attr);
        };
    };
    return TextColor;
}(Mark));
export default TextColor;
//# sourceMappingURL=TextColor.js.map