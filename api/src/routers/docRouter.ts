import auth from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { DocsCtrl } from '../controllers/DocsCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.get('/docs/:id', auth, mapRoute(DocsCtrl, 'view'))
router.post('/docs', auth, mapRoute(DocsCtrl, 'create'))
router.patch('/docs/:id', auth, mapRoute(DocsCtrl, 'update'))
router.delete('/docs/:id', auth, mapRoute(DocsCtrl, 'delete'))

export { router as docRouter }
