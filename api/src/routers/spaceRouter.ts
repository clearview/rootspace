import auth from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { SpacesCtrl } from '../controllers/SpacesCtrl'
import { SpacesUsersCtrl } from '../controllers/SpacesUsersCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.get('/spaces', auth, mapRoute(SpacesCtrl, 'listAll'))
router.post('/spaces', auth, mapRoute(SpacesCtrl, 'create'))
router.patch('/spaces/:id', auth, mapRoute(SpacesCtrl, 'update'))
router.delete('/spaces/:id', auth, mapRoute(SpacesCtrl, 'delete'))

router.get('/spaces/:spaceId/users', auth, mapRoute(SpacesUsersCtrl, 'listAll'))
router.delete(
    '/spaces/:spaceId/users/:userId',
    auth,
    mapRoute(SpacesUsersCtrl, 'remove')
)

export { router as spaceRouter }
