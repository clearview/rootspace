import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import PromiseRouter from 'express-promise-router'
import { ActivityCtrl } from '../controllers/ActivityCtrl'

const router = PromiseRouter()
router.use(authenticate)

router.get('/activities/space/:spaceId', mapRoute(ActivityCtrl, 'getForSpace'))
router.get('/activities/entity/:entity/:entityId', mapRoute(ActivityCtrl, 'getForEntity'))

export { router as activityRouter }
