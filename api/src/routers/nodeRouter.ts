import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { NodeCtrl } from '../controllers/NodeCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.patch('/nodes/:id', authenticate, mapRoute(NodeCtrl, 'update'))
router.post('/nodes/:id/archive', authenticate, mapRoute(NodeCtrl, 'archive'))
router.post('/nodes/:id/restore', authenticate, mapRoute(NodeCtrl, 'restore'))
router.delete('/nodes/:id', authenticate, mapRoute(NodeCtrl, 'delete'))

export { router as nodeRouter }
