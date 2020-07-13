import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { DocsCtrl } from '../controllers/DocsCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/docs/:id', mapRoute(DocsCtrl, 'view'))
router.post('/docs', mapRoute(DocsCtrl, 'create'))
router.patch('/docs/:id', mapRoute(DocsCtrl, 'update'))
router.delete('/docs/:id', mapRoute(DocsCtrl, 'delete'))
router.post('/docs/:id/follow', mapRoute(DocsCtrl, 'follow'))
router.post('/docs/:id/unfollow', mapRoute(DocsCtrl, 'unfollow'))

export { router as docRouter }
