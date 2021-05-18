import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'
import api from '@/utils/api'
import Space from '@/views/Space.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Space,
    children: [
      {
        path: '/',
        name: 'Main',
        component: () => import(/* webpackChunkName: "blank" */ '../views/Blank.vue')
      },
      {
        path: '/settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/Settings/Settings.vue'),
        children: [
          {
            path: '',
            redirect: { name: 'SettingsAccount' },
            name: 'Settings'
          },
          {
            path: 'account',
            name: 'SettingsAccount',
            component: () => import(/* webpackChunkName: "settings-account" */ '../views/Settings/Account.vue')
          },
          {
            path: 'space',
            name: 'SettingsSpace',
            component: () => import(/* webpackChunkName: "settings-space" */ '../views/Settings/Space.vue')
          },
          {
            path: 'space/members',
            name: 'SettingsMembers',
            component: () => import(/* webpackChunkName: "settings-space-members" */ '../views/Settings/SpaceMembers.vue')
          },
          {
            path: 'space/notifications',
            name: 'SettingsNotifications',
            component: () => import(/* webpackChunkName: "settings-space-notification" */ '../views/Settings/SpaceNotifications.vue')
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
        path: '/doc/:id?/:slug?',
        name: 'Novadoc',
        component: () => import(/* webpackChunkName: "document" */ '../views/Novadoc.vue')
      },
      {
        path: '/taskboard/:id',
        name: 'TaskPage',
        component: () => import(/* webpackChunkName: "task-page" */'../views/Task')
      },
      {
        path: '/taskboard/:id/item/:item/:slug?',
        name: 'TaskPageWithItem',
        component: () => import(/* webpackChunkName: "task-page" */'../views/Task')
      },
      {
        path: '/tasklist/:id',
        name: 'ListLane.vue',
        component: () => import(/* webpackChunkName: "task-page" */'../views/Task')
      },
      {
        path: '/tasklist/:id/item/:item/:slug?',
        name: 'TaskListWithItem',
        component: () => import(/* webpackChunkName: "task-page" */'../views/Task')
      },
      {
        path: '/link/:id',
        name: 'Link',
        component: () => import(/* webpackChunkName: "link" */'../views/Link.vue')
      },
      {
        path: '/embed/:id',
        name: 'Embed',
        component: () => import(/* webpackChunkName: "embed" */'../views/Embed.vue')
      }
    ]
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "signin" */ '../views/Public/SignIn.vue'),
    meta: {
      noAuth: true,
      skipAuth: true
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "signup" */ '../views/Public/SignUp.vue'),
    meta: {
      noAuth: true,
      skipAuth: true
    }
  },
  {
    path: '/confirm-email/:token/:id',
    name: 'ConfirmEmail',
    component: () => import(/* webpackChunkName: "signup-success" */ '../views/LandingPage/ConfirmEmail.vue'),
    meta: {
      noAuth: true
    }
  },
  {
    path: '/invitation/:token',
    name: 'Invitation',
    component: () => import(/* webpackChunkName: "signup-success" */ '../views/LandingPage/Invitation.vue'),
    meta: {
      noAuth: true
    }
  },
  {
    path: '/auth/google/callback',
    name: 'GoogleCallback',
    component: () => import(/* webpackChunkName: "google-callback" */ '../views/LandingPage/GoogleCallback.vue'),
    meta: {
      noAuth: true
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import(/* webpackChunkName: "forgot-password" */ '../views/Public/ForgotPassword.vue'),
    meta: {
      noAuth: true
    }
  },
  {
    path: '/password-reset/:token',
    name: 'PasswordReset',
    component: () => import(/* webpackChunkName: "password-reset/" */ '../views/Public/SetPassword.vue'),
    meta: {
      noAuth: true
    }
  },
  {
    path: '/create-space',
    name: 'SpaceInit',
    component: () => import(/* webpackChunkName: "space-init" */ '../views/SpaceInit.vue')
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import(/* webpackChunkName: "forbidden" */ '../views/Forbidden.vue')
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach(async (to, from, next) => {
  const noAuth = to.meta.noAuth
  const skipAuth = to.meta.skipAuth
  const hasToken = store.state.auth.token !== null
  const hasUser = store.state.auth.user !== null
  const roles = to.meta?.roles

  if (hasToken && !hasUser) {
    await store.dispatch('auth/whoami', { updateSpace: true })
    await store.dispatch('space/whoami')
    const activeSpace = store.getters['space/activeSpace']

    if (activeSpace.id && roles && activeSpace.role && !roles.includes(activeSpace.role)) {
      next({ name: 'SettingsAccount' })
    }
  }

  if (hasToken && skipAuth) {
    next('/')
  }
  if (hasToken || noAuth) {
    return next()
  }

  const queryParams = to.fullPath ? { redirectTo: to.fullPath } : {}

  next({ name: 'SignIn', query: queryParams })
})

// FIXME: It's feel a bit hacky. There should be a better way
api.interceptors.response.use(value => {
  return value
}, error => {
  if (error && error.response && error.response.status === 403) {
    Vue.nextTick(() => {
      router.replace('/forbidden').catch(() => null)
    })
  } else if (error && error.response && error.response.status === 404) {
    Vue.nextTick(() => {
      router.replace('/not-found').catch(() => null)
    })
  }
  throw error
})

export default router
