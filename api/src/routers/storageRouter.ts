import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { StorageCtrl } from '../controllers/StorageCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.post('/storages', mapRoute(StorageCtrl, 'create'))
router.patch('/storages/:id', mapRoute(StorageCtrl, 'update'))
router.post('/storages/:id/archive', mapRoute(StorageCtrl, 'archive'))
router.post('/storages/:id/restore', mapRoute(StorageCtrl, 'restore'))
router.delete('/storages/:id', mapRoute(StorageCtrl, 'delete'))

export { router as storageRouter }
