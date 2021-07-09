import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { StorageCtrl } from '../controllers/StorageCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/storages/:id', mapRoute(StorageCtrl, 'view'))
router.get('/storages/:id/files', mapRoute(StorageCtrl, 'files'))
router.get('/storages/:id/trash', mapRoute(StorageCtrl, 'trash'))
router.post('/storages', mapRoute(StorageCtrl, 'create'))
router.patch('/storages/:id', mapRoute(StorageCtrl, 'update'))
router.post('/storages/:id/archive', mapRoute(StorageCtrl, 'archive'))
router.post('/storages/:id/restore', mapRoute(StorageCtrl, 'restore'))
router.delete('/storages/:id', mapRoute(StorageCtrl, 'delete'))

export { router as storageRouter }
