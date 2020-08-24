import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import PromiseRouter from 'express-promise-router'
import { ActivityCtrl } from '../controllers/ActivityCtrl'

const router = PromiseRouter()
router.use(authenticate)

router.get('/activities/space/:spaceId', mapRoute(ActivityCtrl, 'listBySpaceId'))
router.get('/activities/:entityType/:entityId', mapRoute(ActivityCtrl, 'listByEntityTypeAndEntityId'))

export { router as activityRouter }
