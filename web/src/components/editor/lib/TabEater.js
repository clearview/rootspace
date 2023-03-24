import { __extends } from "tslib";
import { Extension, Plugin } from 'tiptap';
var plugins = [
    new Plugin({
        props: {
            handleKeyDown: function (view, event) {
                if (event.key === 'Tab') {
                    event.preventDefault();
                    return false;
                }
            }
        }
    })
];
var TabEater = /** @class */ (function (_super) {
    __extends(TabEater, _super);
    function TabEater() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TabEater.prototype, "name", {
        get: function () {
            return 'tab_eater';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TabEater.prototype, "plugins", {
        get: function () {
            return plugins;
        },
        enumerable: false,
        configurable: true
    });
    return TabEater;
}(Extension));
export default TabEater;
//# sourceMappingURL=TabEater.js.map