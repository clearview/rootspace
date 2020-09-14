import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import PromiseRouter from 'express-promise-router'
import { NotificationsCtrl } from '../controllers/NotificationsCtrl'

const router = PromiseRouter()
router.use(authenticate)

router.get('/notifications/:read?', authenticate, mapRoute(NotificationsCtrl, 'notifications'))
router.get('/notifications/space/:spaceId/:read?', authenticate, mapRoute(NotificationsCtrl, 'notifications'))
router.patch('/notifications/read', authenticate, mapRoute(NotificationsCtrl, 'readNotifications'))
router.patch('/notifications/:id', authenticate, mapRoute(NotificationsCtrl, 'readNotification'))
router.post('/notifications/:entity/:id/read', authenticate, mapRoute(NotificationsCtrl, 'readForEntity'))

export { router as notificationRouter }
