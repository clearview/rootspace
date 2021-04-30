import { authenticate, authenticateRefreshToken } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { UsersCtrl } from '../controllers/UsersCtrl'
import passport from '../passport'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.get(
  '/auth/google',
  (req, res, next) => {
    const { redirectTo } = req.query
    const state = redirectTo
      ? redirectTo.toString()
      : undefined

    passport.authenticate('google', {
      session: false,
      scope: ['openid profile email '],
      state,
    })(req, res, next)
  }
)

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  mapRoute(UsersCtrl, 'authGoogleCallback')
)

router.post('/auth', mapRoute(UsersCtrl, 'auth'))
router.get('/users/token', authenticateRefreshToken, mapRoute(UsersCtrl, 'refreshToken'))

router.post('/signup', mapRoute(UsersCtrl, 'signup'))
router.patch('/users/confirm/email', mapRoute(UsersCtrl, 'confirmEmail'))

router.get('/whoami', authenticate, mapRoute(UsersCtrl, 'whoami'))
router.get('/users/:id/profile', authenticate, mapRoute(UsersCtrl, 'profile'))
router.patch('/users', authenticate, mapRoute(UsersCtrl, 'update'))

router.patch('/users/password', authenticate, [
  mapRoute(UsersCtrl, 'changePassword'),
  mapRoute(UsersCtrl, 'setPassword'),
])
router.post('/users/password/recovery', mapRoute(UsersCtrl, 'passwordRecovery'))
router.get('/password/reset/verify/:token', mapRoute(UsersCtrl, 'verifyPasswordReset'))
router.post('/users/password/reset', mapRoute(UsersCtrl, 'passwordReset'))

router
  .route('/users/settings/:spaceId?')
  .get(authenticate, mapRoute(UsersCtrl, 'settings'))
  .post(authenticate, mapRoute(UsersCtrl, 'updateSettings'))
  .put(authenticate, mapRoute(UsersCtrl, 'updateSettings'))

export { router as userRouter }
