var PageModule = {
    namespaced: true,
    state: function () {
        return {
            ready: false
        };
    },
    mutations: {
        setReady: function (state, ready) {
            state.ready = ready;
        }
    }
};
export default PageModule;
//# sourceMappingURL=page.js.map