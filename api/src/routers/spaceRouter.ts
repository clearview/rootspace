import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { SpacesCtrl } from '../controllers/SpacesCtrl'
import { SpacesUsersCtrl } from '../controllers/SpacesUsersCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/spaces', mapRoute(SpacesCtrl, 'listAll'))
router.post('/spaces', mapRoute(SpacesCtrl, 'create'))
router.patch('/spaces/:id', mapRoute(SpacesCtrl, 'update'))
router.delete('/spaces/:id', mapRoute(SpacesCtrl, 'delete'))

router.get('/spaces/:spaceId/users', mapRoute(SpacesUsersCtrl, 'listAll'))
router.delete('/spaces/:spaceId/users/:userId', mapRoute(SpacesUsersCtrl, 'remove'))

export { router as spaceRouter }
