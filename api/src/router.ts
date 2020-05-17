import express from 'express'
import { config } from 'node-config-ts'
import { UsersCtrl } from './controllers/UsersCtrl'
import { SpacesCtrl } from './controllers/SpacesCtrl'
import { InviteCtrl } from './controllers/InviteCtrl'
import { LinksCtrl } from './controllers/LinksCtrl'
import { DocsCtrl } from './controllers/DocsCtrl'
import { UploadsCtrl } from './controllers/UploadsCtrl'
import { SpacesUsersCtrl } from './controllers/SpacesUsersCtrl'
import passport from './passport'
import multer from 'multer'
import auth from './middleware/AuthMiddleware'
import { mapRoute } from './utils'
import path from 'path'

const router = express.Router()
const upload = multer({
  dest: path.resolve(config.uploadDir),
})

router.get('/', async (req, res) => {
  res.send({ Root: 'app' })
})

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

router.get('/spaces', auth, mapRoute(SpacesCtrl, 'listAll'))
router.get('/spaces/:id', auth, mapRoute(SpacesCtrl, 'view'))
router.post('/spaces', auth, mapRoute(SpacesCtrl, 'create'))
router.patch('/spaces/:id', auth, mapRoute(SpacesCtrl, 'update'))
router.delete('/spaces/:id', auth, mapRoute(SpacesCtrl, 'delete'))

router.get('/spaces/:spaceId/users', auth, mapRoute(SpacesUsersCtrl, 'listAll'))
router.delete(
  '/spaces/:spaceId/users/:userId',
  auth,
  mapRoute(SpacesUsersCtrl, 'remove')
)

router.post('/invites/accept', auth, mapRoute(InviteCtrl, 'accept'))

router.get('/links/:spaceId', auth, mapRoute(LinksCtrl, 'listAll'))
router.get('/links/view/:id', auth, mapRoute(LinksCtrl, 'view'))
router.post('/links', auth, mapRoute(LinksCtrl, 'create'))
router.patch('/links/:id', auth, mapRoute(LinksCtrl, 'update'))
router.delete('/links/:id', auth, mapRoute(LinksCtrl, 'delete'))

router.get('/docs/:id', auth, mapRoute(DocsCtrl, 'view'))
router.post('/docs', auth, mapRoute(DocsCtrl, 'create'))
router.patch('/docs/:id', auth, mapRoute(DocsCtrl, 'update'))
router.delete('/docs/:id', auth, mapRoute(DocsCtrl, 'delete'))

router.post(
  '/upload',
  auth,
  upload.single('file'),
  mapRoute(UploadsCtrl, 'index')
)

export default router
