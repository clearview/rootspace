import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import PromiseRouter from 'express-promise-router'
import { ActivityCtrl } from '../controllers/ActivityCtrl'

const router = PromiseRouter()
router.use(authenticate)

router.get('/activities/space/:spaceId', mapRoute(ActivityCtrl, 'getActivitiesBySpace'))
router.get('/activities/space/:spaceId/:entity/:entityId', mapRoute(ActivityCtrl, 'getForEntity'))
router.get('/activities/space/:spaceId/:entity/:entityId/raw', mapRoute(ActivityCtrl, 'getRawForEntity'))

export { router as activityRouter }
