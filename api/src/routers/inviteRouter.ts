import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { InvitesCtrl } from '../controllers/InvitesCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.post('/invites/create', mapRoute(InvitesCtrl, 'create'))
router.delete('/invites/cancel/:inviteId', mapRoute(InvitesCtrl, 'cancel'))
router.post('/invites/accept', mapRoute(InvitesCtrl, 'accept'))

export { router as inviteRouter }
