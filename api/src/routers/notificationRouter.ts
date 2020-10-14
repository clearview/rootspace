import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import PromiseRouter from 'express-promise-router'
import { NotificationsCtrl } from '../controllers/NotificationsCtrl'

const router = PromiseRouter()
router.use(authenticate)

router.get('/notifications/:read?', mapRoute(NotificationsCtrl, 'notifications'))
router.get('/notifications/space/:spaceId/:read?', mapRoute(NotificationsCtrl, 'notifications'))
router.patch('/notifications/read', mapRoute(NotificationsCtrl, 'readNotifications'))
router.patch('/notifications/:id', mapRoute(NotificationsCtrl, 'readNotification'))
router.post('/notifications/:entity/:id/read', mapRoute(NotificationsCtrl, 'readForEntity'))

export { router as notificationRouter }
