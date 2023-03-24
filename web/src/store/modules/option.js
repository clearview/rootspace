var OptionModule = {
    namespaced: true,
    state: function () {
        return {
            redirect: null
        };
    },
    mutations: {
        setRedirect: function (state, redirect) {
            state.redirect = redirect;
        }
    }
};
export default OptionModule;
//# sourceMappingURL=option.js.map