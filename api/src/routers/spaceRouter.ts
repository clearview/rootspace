import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { SpacesCtrl } from '../controllers/SpacesCtrl'
import { SpacesUsersCtrl } from '../controllers/SpacesUsersCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/spaces/:id/tree', authenticate, mapRoute(SpacesCtrl, 'getTree'))
router.get('/spaces', authenticate, mapRoute(SpacesCtrl, 'listAll'))
router.post('/spaces', authenticate, mapRoute(SpacesCtrl, 'create'))
router.patch('/spaces/:id', authenticate, mapRoute(SpacesCtrl, 'update'))
router.delete('/spaces/:id', authenticate, mapRoute(SpacesCtrl, 'delete'))

router.get('/spaces/:spaceId/users', mapRoute(SpacesUsersCtrl, 'listAll'))
router.delete(
  '/spaces/:spaceId/users/:userId',
  mapRoute(SpacesUsersCtrl, 'remove')
)

export { router as spaceRouter }
