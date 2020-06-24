import { auth } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import {InviteCtrl} from '../controllers/InviteCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.post('/invites/create', auth, mapRoute(InviteCtrl, 'create'))
router.post('/invites/accept', auth, mapRoute(InviteCtrl, 'accept'))

export { router as inviteRouter }
