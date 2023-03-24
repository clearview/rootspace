import { authenticate } from '../middleware/AuthMiddleware'
import { config } from 'node-config-ts'
import { mapRoute } from '../utils'
import { UploadsCtrl } from '../controllers/UploadsCtrl'
import multer from 'multer'
import path from 'path'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

const upload = multer({
  dest: path.resolve(config.uploadDir),
})

router.get('/uploads/:id/download', mapRoute(UploadsCtrl, 'download'))

router.post('/uploads', upload.single('file'), [
  mapRoute(UploadsCtrl, 'uploadUserAvatar'),
  mapRoute(UploadsCtrl, 'uploadSpaceLogo'),
  mapRoute(UploadsCtrl, 'upload'),
])

router.patch('/uploads/:id', mapRoute(UploadsCtrl, 'update'))
router.post('/uploads/:id/archive', mapRoute(UploadsCtrl, 'archive'))
router.post('/uploads/:id/trash', mapRoute(UploadsCtrl, 'trash'))
router.post('/uploads/:id/restore', mapRoute(UploadsCtrl, 'restore'))
router.delete('/uploads/:id', mapRoute(UploadsCtrl, 'delete'))

export { router as uploadRouter }
