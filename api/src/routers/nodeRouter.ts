import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { NodeCtrl } from '../controllers/NodeCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.patch('/nodes/:id', authenticate, mapRoute(NodeCtrl, 'update'))
router.delete('/nodes/:id', authenticate, mapRoute(NodeCtrl, 'delete'))

export { router as nodeRouter }
