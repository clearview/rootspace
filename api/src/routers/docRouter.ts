import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { DocsCtrl } from '../controllers/DocsCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
// router.use(authenticate)

router.get('/docs/:id', mapRoute(DocsCtrl, 'view'))
router.get('/docs/:id/history', mapRoute(DocsCtrl, 'history'))
router.post('/docs', mapRoute(DocsCtrl, 'create'))
router.patch('/docs/:id', mapRoute(DocsCtrl, 'update'))
router.post('/docs/:id/restore/:revisionId', mapRoute(DocsCtrl, 'restoreRevision'))
router.post('/docs/:id/archive', mapRoute(DocsCtrl, 'archive'))
router.post('/docs/:id/restore', mapRoute(DocsCtrl, 'restore'))
router.delete('/docs/:id', mapRoute(DocsCtrl, 'delete'))
router.post('/docs/:id/follow', mapRoute(DocsCtrl, 'follow'))
router.post('/docs/:id/unfollow', mapRoute(DocsCtrl, 'unfollow'))

export { router as docRouter }
