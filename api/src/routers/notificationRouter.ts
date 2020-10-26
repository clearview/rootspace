import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import PromiseRouter from 'express-promise-router'
import { NotificationsCtrl } from '../controllers/NotificationsCtrl'

const router = PromiseRouter()
router.use(authenticate)

router.get('/notifications/space/:spaceId', mapRoute(NotificationsCtrl, 'getForSpace'))
router.patch('/notifications/seen/:id', mapRoute(NotificationsCtrl, 'seen'))
router.patch('/notifications/seen/entity/:entityName/:entityId', mapRoute(NotificationsCtrl, 'seenForEntity'))
router.patch('/notifications/seen/space/:spaceId', mapRoute(NotificationsCtrl, 'seenForSpace'))

export { router as notificationRouter }
