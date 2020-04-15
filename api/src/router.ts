import express from 'express'
import { UsersCtrl } from './controllers/UsersCtrl'
import { LinksCtrl } from './controllers/LinksCtrl'
import { SpacesCtrl } from './controllers/SpacesCtrl'
import passport from './passport'
import auth from './middleware/AuthMiddleware'
import { mapRoute } from './utils'

const router = express.Router()

router.get('/', async (req, res) => {
  res.send({ Root: 'app' })
})

router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['openid profile email ']
  })
)
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  mapRoute(UsersCtrl, 'authGoogleCallback')
)
router.get('/auth', mapRoute(UsersCtrl, 'auth'))
router.get('/whoami', auth, mapRoute(UsersCtrl, 'whoami'))
router.post('/signup', mapRoute(UsersCtrl, 'signup'))
router.patch('/user/confirm', mapRoute(UsersCtrl, 'confirm'))

router.get('/spaces', auth, mapRoute(SpacesCtrl, 'listAll'))
router.get('/spaces/:id', auth, mapRoute(SpacesCtrl, 'view'))
router.post('/spaces', auth, mapRoute(SpacesCtrl, 'create'))
router.patch('/spaces/:id', auth, mapRoute(SpacesCtrl, 'update'))
router.delete('/spaces/:id', auth, mapRoute(SpacesCtrl, 'delete'))

router.get('/links', auth, mapRoute(LinksCtrl, 'listAll'))
router.get('/links/:id', auth, mapRoute(LinksCtrl, 'view'))
router.post('/links', auth, mapRoute(LinksCtrl, 'create'))
router.patch('/links/:id', auth, mapRoute(LinksCtrl, 'update'))
router.delete('/links/:id', auth, mapRoute(LinksCtrl, 'delete'))

export default router
