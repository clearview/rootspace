import { __awaiter, __generator } from "tslib";
import DocumentService from '@/services/document';
var DocumentModule = {
    namespaced: true,
    state: function () {
        return {
            payload: [],
            deferredParent: null
        };
    },
    mutations: {
        setPayload: function (state, payload) {
            state.payload = payload;
        },
        setDeferredParent: function (state, payload) {
            state.deferredParent = payload;
        }
    },
    actions: {
        destroy: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!data.id) {
                                throw new Error('ID is not defined');
                            }
                            return [4 /*yield*/, DocumentService.destroy(data.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
export default DocumentModule;
//# sourceMappingURL=document.js.map