var minSize = 282;
var SidebarModule = {
    namespaced: true,
    state: function () {
        return {
            collapse: false,
            size: minSize
        };
    },
    mutations: {
        setCollapse: function (state, collapse) {
            state.collapse = collapse;
        },
        setSize: function (state, size) {
            state.size = Math.max(minSize, size);
        }
    }
};
export default SidebarModule;
//# sourceMappingURL=sidebar.js.map