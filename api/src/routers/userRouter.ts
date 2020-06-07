import auth from '../middleware/AuthMiddleware'
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

router.get('/whoami', auth, mapRoute(UsersCtrl, 'whoami'))
router.post('/signup', mapRoute(UsersCtrl, 'signup'))
router.patch('/user/confirm/email', mapRoute(UsersCtrl, 'confirmEmail'))
router.patch('/user/update', auth, mapRoute(UsersCtrl, 'update'))
router.patch(
    '/user/password/change',
    auth,
    mapRoute(UsersCtrl, 'changePassword')
)

export { router as userRouter }
