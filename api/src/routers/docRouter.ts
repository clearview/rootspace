import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { DocsCtrl } from '../controllers/DocsCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.get('/docs/:id', mapRoute(DocsCtrl, 'publicView'))
router.get('/docs/:id', authenticate, mapRoute(DocsCtrl, 'authenticatedView'))
router.get('/docs/:id/history', authenticate, mapRoute(DocsCtrl, 'history'))
router.post('/docs', authenticate, mapRoute(DocsCtrl, 'create'))
router.patch('/docs/:id', authenticate, mapRoute(DocsCtrl, 'update'))
router.post('/docs/:id/restore/:revisionId', authenticate, mapRoute(DocsCtrl, 'restoreRevision'))
router.post('/docs/:id/archive', authenticate, mapRoute(DocsCtrl, 'archive'))
router.post('/docs/:id/restore', authenticate, mapRoute(DocsCtrl, 'restore'))
router.delete('/docs/:id', authenticate, mapRoute(DocsCtrl, 'delete'))
router.post('/docs/:id/follow', authenticate, mapRoute(DocsCtrl, 'follow'))
router.post('/docs/:id/unfollow', authenticate, mapRoute(DocsCtrl, 'unfollow'))

export { router as docRouter }
