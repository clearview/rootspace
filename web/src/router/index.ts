import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { roleIdAdmin } from '@/mixins/RoleMixin'

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
            meta: { hasRoles: [roleIdAdmin] },
            component: () => import(/* webpackChunkName: "settings-space" */ '../views/Settings/Space.vue')
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
        component: () => import(/* webpackChunkName: "task-page" */'../views/Task/TaskPage.vue')
      },
      {
        path: '/taskboard/:id/item/:item/:slug?',
        name: 'TaskPageWithItem',
        component: () => import(/* webpackChunkName: "task-page" */'../views/Task/TaskPage.vue')
      },
      {
        path: '/tasklist/:id',
        name: 'ListLane.vue',
        component: () => import(/* webpackChunkName: "task-page" */'../views/Task/TaskPage.vue')
      },
      {
        path: '/tasklist/:id/item/:item/:slug?',
        name: 'TaskListWithItem',
        component: () => import(/* webpackChunkName: "task-page" */'../views/Task/TaskPage.vue')
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
  const hasRoles = to.meta.hasRoles
  const hasToken = store.state.auth.token !== null
  const hasUser = store.state.auth.user !== null

  if (hasToken && !hasUser) {
    await store.dispatch('auth/whoami', { updateSpace: true, spaceId: store.state.space.activeSpaceId })
  }

  if (hasToken && hasUser && store.state.space.activeSpaceId) {
    await store.dispatch('auth/setUserRoles', {
      spaceId: store.state.space.activeSpaceId,
      userId: store.state.auth.user?.id
    })
  }

  if (hasRoles) {
    const hasRole = await store.dispatch('auth/hasRoles', {
      spaceId: store.state.space.activeSpaceId,
      userId: store.state.auth.user?.id,
      hasRoles
    })

    if (!hasRole) {
      next('/')
    }
  }

  if ((hasToken && skipAuth)) {
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
