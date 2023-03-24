export function createSettingsModule(defaults) {
    return {
        namespaced: true,
        state: function () {
            return defaults();
        },
        mutations: {
            setData: function (state, setter) {
                setter(state);
            }
        },
        actions: {}
    };
}
//# sourceMappingURL=createSettingsModule.js.map