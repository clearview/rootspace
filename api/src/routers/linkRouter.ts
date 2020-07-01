import { authenticate, authorize, Actions, Subjects } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { LinksCtrl } from '../controllers/LinksCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/links/:spaceId', mapRoute(LinksCtrl, 'listAll'))
router.get('/links/view/:id', authorize(Subjects.Link, Actions.Read), mapRoute(LinksCtrl, 'view'))
router.post('/links', mapRoute(LinksCtrl, 'create'))
router.patch('/links/:id', mapRoute(LinksCtrl, 'update'))
router.delete('/links/:id', mapRoute(LinksCtrl, 'delete'))

export { router as linkRouter }
