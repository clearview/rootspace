import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import PromiseRouter from 'express-promise-router'
import { ActivitiesCtrl } from '../controllers/ActivitiesCtrl'

const router = PromiseRouter()
router.use(authenticate)

router.get('/activities/space/:spaceId', mapRoute(ActivitiesCtrl, 'getForSpace'))
router.get('/activities/entity/:entity/:entityId', mapRoute(ActivitiesCtrl, 'getForEntity'))

export { router as activityRouter }
