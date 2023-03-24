import { __assign, __extends } from "tslib";
import { Node, Plugin, TextSelection } from 'tiptap';
var Paragraph = /** @class */ (function (_super) {
    __extends(Paragraph, _super);
    function Paragraph() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Paragraph.prototype, "name", {
        get: function () {
            return 'paragraph';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paragraph.prototype, "schema", {
        get: function () {
            return {
                content: 'inline*',
                group: 'block',
                draggable: false,
                attrs: {
                    align: {
                        default: 'left'
                    },
                    level: {
                        default: 0
                    }
                },
                parseDOM: [
                    {
                        tag: 'p.novadoc-paragraph',
                        getAttrs: function (node) { return ({
                            align: node.style.textAlign,
                            level: 0
                        }); }
                    },
                    {
                        tag: 'h1.novadoc-paragraph',
                        getAttrs: function (node) { return ({
                            align: node.style.textAlign,
                            level: 1
                        }); }
                    },
                    {
                        tag: 'h2.novadoc-paragraph',
                        getAttrs: function (node) { return ({
                            align: node.style.textAlign,
                            level: 2
                        }); }
                    },
                    {
                        tag: 'h3.novadoc-paragraph',
                        getAttrs: function (node) { return ({
                            align: node.style.textAlign,
                            level: 3
                        }); }
                    }
                ],
                toDOM: function (node) {
                    if (node.attrs.level === 0) {
                        return ['p', {
                                class: 'novadoc-paragraph',
                                style: "text-align: ".concat(node.attrs.align, ";")
                            }, 0];
                    }
                    else if (node.attrs.level === 1) {
                        return ['h1', {
                                class: 'novadoc-paragraph',
                                style: "text-align: ".concat(node.attrs.align, ";")
                            }, 0];
                    }
                    else if (node.attrs.level === 2) {
                        return ['h2', {
                                class: 'novadoc-paragraph',
                                style: "text-align: ".concat(node.attrs.align, ";")
                            }, 0];
                    }
                    else if (node.attrs.level === 3) {
                        return ['h3', {
                                class: 'novadoc-paragraph',
                                style: "text-align: ".concat(node.attrs.align, ";")
                            }, 0];
                    }
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Paragraph.prototype.commands = function (_a) {
        var type = _a.type;
        return function (attrs) { return function (state, dispatch) {
            var tr = state.tr;
            var $from = state.selection.$from;
            var toParagraph = $from.before($from.depth);
            var existingAttr = $from.node($from.depth).attrs ? $from.node($from.depth).attrs : {};
            tr.setNodeMarkup(toParagraph, type, __assign(__assign({}, existingAttr), attrs));
            dispatch(tr);
        }; };
    };
    Object.defineProperty(Paragraph.prototype, "plugins", {
        get: function () {
            return [
                new Plugin({
                    props: {
                        handleKeyDown: function (view, evt) {
                            if (evt.key === 'Enter') {
                                var tr = view.state.tr;
                                var sel = view.state.selection;
                                var node = sel.$from.node(sel.$from.depth);
                                if (node.type.name === 'paragraph' && node.attrs.level > 0) {
                                    var before = sel.$from.before(sel.$from.depth);
                                    var parentOffset = sel.$from.parentOffset;
                                    if (parentOffset === 0) {
                                        view.dispatch(tr.insert(before, node.type.create({ level: 0 }))
                                            .setSelection(TextSelection.create(tr.doc, before + 1)) // +1 to enter the paragraph
                                        );
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                })
            ];
        },
        enumerable: false,
        configurable: true
    });
    return Paragraph;
}(Node));
export default Paragraph;
//# sourceMappingURL=Paragraph.js.map