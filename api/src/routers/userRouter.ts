import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import passport from '../passport'
import {UsersCtrl} from '../controllers/UsersCtrl'
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
router.post('/signup', mapRoute(UsersCtrl, 'signup'))
router.patch('/user/confirm/email', mapRoute(UsersCtrl, 'confirmEmail'))
router.patch('/user/update', authenticate, mapRoute(UsersCtrl, 'update'))
router.patch(
    '/user/password/change',
    authenticate,
    mapRoute(UsersCtrl, 'changePassword')
)

export { router as userRouter }
