import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { FolderCtrl } from '../controllers/FolderCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.post('/folders', mapRoute(FolderCtrl, 'create'))
router.patch('/folders/:id', mapRoute(FolderCtrl, 'update'))
router.post('/folders/:id/archive', mapRoute(FolderCtrl, 'archive'))
router.post('/folders/:id/restore', mapRoute(FolderCtrl, 'restore'))
router.delete('/folders/:id', mapRoute(FolderCtrl, 'delete'))

export { router as folderRouter }
