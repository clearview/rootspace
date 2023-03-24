import { __awaiter, __generator } from "tslib";
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import Space from '@/views/Space.vue';
import Novadoc from '@/views/Novadoc.vue';
Vue.use(VueRouter);
var routes = [
    {
        path: '/',
        component: Space,
        children: [
            {
                path: '/',
                name: 'Main',
                component: function () { return import(/* webpackChunkName: "blank" */ '../views/Blank.vue'); }
            },
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: function () { return import(/* webpackChunkName: "blank" */ '../views/Blank.vue'); }
            },
            {
                path: '/settings',
                component: function () { return import(/* webpackChunkName: "settings" */ '../views/Settings/Settings.vue'); },
                children: [
                    {
                        path: '',
                        redirect: { name: 'SettingsAccount' },
                        name: 'Settings'
                    },
                    {
                        path: 'account',
                        name: 'SettingsAccount',
                        component: function () { return import(/* webpackChunkName: "settings-account" */ '../views/Settings/Account.vue'); }
                    },
                    {
                        path: 'space',
                        name: 'SettingsSpace',
                        component: function () { return import(/* webpackChunkName: "settings-space" */ '../views/Settings/Space.vue'); }
                    },
                    {
                        path: 'space/members',
                        name: 'SettingsMembers',
                        component: function () { return import(/* webpackChunkName: "settings-space-members" */ '../views/Settings/SpaceMembers.vue'); }
                    },
                    {
                        path: 'space/notifications',
                        name: 'SettingsNotifications',
                        component: function () { return import(/* webpackChunkName: "settings-space-notification" */ '../views/Settings/SpaceNotifications.vue'); }
                    }
                ]
            },
            {
                path: '/document/:id?/:slug?',
                name: 'Document',
                redirect: {
                    name: 'Novadoc'
                }
            },
            {
                path: '/doc/:id(\\d+)/:slug?',
                name: 'Novadoc',
                component: function () { return import(/* webpackChunkName: "document" */ '../views/Novadoc.vue'); }
            },
            {
                path: '/taskboard/:id',
                name: 'TaskPage',
                component: function () { return import(/* webpackChunkName: "task-page" */ '../views/Task'); }
            },
            {
                path: '/taskboard/:id/item/:item/:slug?',
                name: 'TaskPageWithItem',
                component: function () { return import(/* webpackChunkName: "task-page" */ '../views/Task'); }
            },
            {
                path: '/tasklist/:id',
                name: 'ListLane.vue',
                component: function () { return import(/* webpackChunkName: "task-page" */ '../views/Task'); }
            },
            {
                path: '/tasklist/:id/item/:item/:slug?',
                name: 'TaskListWithItem',
                component: function () { return import(/* webpackChunkName: "task-page" */ '../views/Task'); }
            },
            {
                path: '/link/:id',
                name: 'Link',
                component: function () { return import(/* webpackChunkName: "link" */ '../views/Link.vue'); }
            },
            {
                path: '/embed/:id',
                name: 'Embed',
                component: function () { return import(/* webpackChunkName: "embed" */ '../views/Embed.vue'); }
            },
            {
                path: '/storage/:id',
                name: 'Storage',
                component: function () { return import(/* webpackChunkName: "storage" */ '../views/Storage/StoragePage.vue'); }
            }
        ]
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: function () { return import(/* webpackChunkName: "signin" */ '../views/Public/SignIn.vue'); },
        meta: {
            noAuth: true,
            skipAuth: true
        }
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: function () { return import(/* webpackChunkName: "signup" */ '../views/Public/SignUp.vue'); },
        meta: {
            noAuth: true,
            skipAuth: true
        }
    },
    {
        path: '/confirm-email/:token/:id',
        name: 'ConfirmEmail',
        component: function () { return import(/* webpackChunkName: "signup-success" */ '../views/LandingPage/ConfirmEmail.vue'); },
        meta: {
            noAuth: true
        }
    },
    {
        path: '/invitation/:token',
        name: 'Invitation',
        component: function () { return import(/* webpackChunkName: "signup-success" */ '../views/LandingPage/Invitation.vue'); },
        meta: {
            noAuth: true
        }
    },
    {
        path: '/auth/google/callback',
        name: 'GoogleCallback',
        component: function () { return import(/* webpackChunkName: "google-callback" */ '../views/LandingPage/GoogleCallback.vue'); },
        meta: {
            noAuth: true
        }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: function () { return import(/* webpackChunkName: "forgot-password" */ '../views/Public/ForgotPassword.vue'); },
        meta: {
            noAuth: true
        }
    },
    {
        path: '/password-reset/:token',
        name: 'PasswordReset',
        component: function () { return import(/* webpackChunkName: "password-reset/" */ '../views/Public/SetPassword.vue'); },
        meta: {
            noAuth: true
        }
    },
    {
        path: '/create-space',
        name: 'SpaceInit',
        component: function () { return import(/* webpackChunkName: "space-init" */ '../views/SpaceInit.vue'); }
    },
    {
        path: '/forbidden',
        name: 'Forbidden',
        component: function () { return import(/* webpackChunkName: "forbidden" */ '../views/Forbidden.vue'); }
    },
    {
        path: '/doc/:id',
        name: 'PublicDocument',
        component: Novadoc,
        meta: {
            noAuth: true
        }
    },
    {
        path: '*',
        component: function () { return import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue'); }
    }
];
var router = new VueRouter({
    routes: routes,
    mode: 'history'
});
router.beforeEach(function (to, from, next) { return __awaiter(void 0, void 0, void 0, function () {
    var noAuth, skipAuth, hasToken, hasUser, roles, activeSpace, queryParams;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                noAuth = to.meta.noAuth;
                skipAuth = to.meta.skipAuth;
                hasToken = store.state.auth.token !== null;
                hasUser = store.state.auth.user !== null;
                roles = (_a = to.meta) === null || _a === void 0 ? void 0 : _a.roles;
                if (!(hasToken && !hasUser)) return [3 /*break*/, 3];
                return [4 /*yield*/, store.dispatch('auth/whoami', { updateSpace: true })];
            case 1:
                _b.sent();
                return [4 /*yield*/, store.dispatch('space/whoami')];
            case 2:
                _b.sent();
                activeSpace = store.getters['space/activeSpace'];
                if (activeSpace.id && roles && activeSpace.role && !roles.includes(activeSpace.role)) {
                    next({ name: 'SettingsAccount' });
                }
                _b.label = 3;
            case 3:
                if (hasToken && skipAuth) {
                    next('/');
                }
                if (hasToken || noAuth) {
                    return [2 /*return*/, next()];
                }
                queryParams = to.fullPath ? { redirectTo: to.fullPath } : {};
                next({ name: 'SignIn', query: queryParams });
                return [2 /*return*/];
        }
    });
}); });
// FIXME: It's feel a bit hacky. There should be a better way
// api.interceptors.response.use(value => {
//   return value
// }, error => {
//   if (error && error.response && error.response.status === 403) {
//     Vue.nextTick(() => {
//       router.replace('/forbidden').catch(() => null)
//     })
//   } else if (error && error.response && error.response.status === 404) {
//     Vue.nextTick(() => {
//       router.replace('/not-found').catch(() => null)
//     })
//   }
//   throw error
// })
export default router;
//# sourceMappingURL=index.js.map