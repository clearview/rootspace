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

router.post('/upload', upload.single('file'), mapRoute(UploadsCtrl, 'index'))

export { router as uploadRouter }
