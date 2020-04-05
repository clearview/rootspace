import express from 'express'
import { UsersCtrl } from './controllers/UsersCtrl'
import { LinksCtrl } from './controllers/LinksCtrl'
import { SpacesCtrl } from './controllers/SpacesCtrl'
import passport from './passport'
import { mapRoute } from './utils'

const router = express.Router()

router.get('/', async (req, res) => { res.send({ Root: 'app' }) })

router.get('/auth', mapRoute(UsersCtrl, 'auth'))
router.get('/auth/google', 
  passport.authenticate('google', { session: false, scope: ['openid profile email '] })
)
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  mapRoute(UsersCtrl, 'authGoogleCallback')
)


router.get('/spaces', passport.authenticate('jwt', {session: false}), mapRoute(SpacesCtrl, 'listAll'))
router.get('/spaces/:id', mapRoute(SpacesCtrl, 'view'))
router.post('/spaces', mapRoute(SpacesCtrl, 'create'))
router.patch('/spaces/:id', mapRoute(SpacesCtrl, 'update'))
router.delete('/spaces/:id', mapRoute(SpacesCtrl, 'delete'))

export default router