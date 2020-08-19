import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { EmbedCtrl } from '../controllers/EmbedCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/embeds/:id', mapRoute(EmbedCtrl, 'view'))
router.post('/embeds', mapRoute(EmbedCtrl, 'create'))
router.patch('/embeds/:id', mapRoute(EmbedCtrl, 'update'))
router.post('/embeds/:id/archive', mapRoute(EmbedCtrl, 'archive'))
router.post('/embeds/:id/restore', mapRoute(EmbedCtrl, 'restore'))
router.delete('/embeds/:id', mapRoute(EmbedCtrl, 'delete'))

export { router as embedRouter }
