import { __extends } from "tslib";
import { Extension, Plugin } from 'tiptap';
import { joinUp } from 'tiptap-commands';
var plugins = [
    new Plugin({
        props: {
            handleKeyDown: function (view, event) {
                if (event.key === 'Tab' && !event.shiftKey) {
                    var sel = view.state.selection;
                    var currentList = sel.$from.node(sel.$from.depth - 1);
                    var currentListParent = sel.$from.node(sel.$from.depth - 2);
                    var currentListGrandParent = sel.$from.node(sel.$from.depth - 3);
                    // We want to merge only if its the first child
                    if (currentList.type.name === 'list_item' &&
                        (currentListParent.type.name === 'ordered_list' || currentListParent.type.name === 'bullet_list') &&
                        currentListGrandParent.type.name !== 'list_item' &&
                        currentListParent.childCount === 1) {
                        joinUp(view.state, view.dispatch);
                    }
                }
            }
        }
    })
];
var ListMerger = /** @class */ (function (_super) {
    __extends(ListMerger, _super);
    function ListMerger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ListMerger.prototype, "name", {
        get: function () {
            return 'list_merger';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ListMerger.prototype, "plugins", {
        get: function () {
            return plugins;
        },
        enumerable: false,
        configurable: true
    });
    return ListMerger;
}(Extension));
export default ListMerger;
//# sourceMappingURL=ListMerger.js.map