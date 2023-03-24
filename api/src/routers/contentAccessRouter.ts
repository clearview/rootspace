import { authenticate } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { ContentAccessCtrl } from '../controllers/ContentAccessCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/content/access/:entity/:entityId', mapRoute(ContentAccessCtrl, 'view'))
router.put('/content/access/:entity/:entityId', mapRoute(ContentAccessCtrl, 'update'))

export { router as contentAccessRouter }
