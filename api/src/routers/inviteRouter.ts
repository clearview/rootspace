import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { InviteCtrl } from '../controllers/InviteCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.post('/invites/create', mapRoute(InviteCtrl, 'create'))
router.delete('/invites/cancel/:inviteId', mapRoute(InviteCtrl, 'cancel'))
router.post('/invites/accept', mapRoute(InviteCtrl, 'accept'))

export { router as inviteRouter }
