import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { UsersCtrl } from '../controllers/UsersCtrl'
import passport from '../passport'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['openid profile email '],
  })
)

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  mapRoute(UsersCtrl, 'authGoogleCallback')
)

router.post('/auth', mapRoute(UsersCtrl, 'auth'))

router.get('/whoami', authenticate, mapRoute(UsersCtrl, 'whoami'))
router.get('/notifications/:read?', authenticate, mapRoute(UsersCtrl, 'notifications'))
router.post('/signup', mapRoute(UsersCtrl, 'signup'))
router.patch('/users', authenticate, mapRoute(UsersCtrl, 'update'))
router.patch('/users/confirm/email', mapRoute(UsersCtrl, 'confirmEmail'))
router.patch(
  '/users/password',
  authenticate,
  mapRoute(UsersCtrl, 'changePassword')
)

export { router as userRouter }
