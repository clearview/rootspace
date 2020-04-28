import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'
import Main from '@/views/Main.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "signin" */ '../views/Public/SignIn.vue'),
    meta: {
      noAuth: true
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "signup" */ '../views/Public/SignUp.vue'),
    meta: {
      noAuth: true
    }
  },
  {
    path: '/signup-success',
    name: 'SignUpSuccess',
    component: () => import(/* webpackChunkName: "signup-success" */ '../views/LandingPage/SignUpSuccess.vue'),
    meta: {
      noAuth: true
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
    path: '/invitation/:token/:id',
    name: 'Invitation',
    component: () => import(/* webpackChunkName: "signup-success" */ '../views/LandingPage/Invitation.vue')
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
    path: '/create-workspace',
    name: 'CreateWorkspace',
    component: () => import(/* webpackChunkName: "create-workspace" */ '../views/CreateWorkspace.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const userSpaces = store.state.auth.spaces
  const isSpacesEmpty = (userSpaces && Object.keys(userSpaces).length === 0)
  const noAuth = to.matched.some(record => record.meta.noAuth)
  const isTokenSet = (store.state.auth.token !== null)

  if (!noAuth && !isTokenSet) {
    return next('/signin')
  }

  if (noAuth && isTokenSet) {
    return next('/')
  }

  if (isSpacesEmpty && isTokenSet && to.name !== 'CreateWorkspace') {
    return next('/create-workspace')
  }

  if (!isSpacesEmpty && isTokenSet && to.name === 'CreateWorkspace') {
    return next('/')
  }

  return next()
})

export default router
