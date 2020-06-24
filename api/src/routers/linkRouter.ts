import { auth, authorize, Actions, Objects } from '../middleware/AuthMiddleware'
import {mapRoute} from '../utils'
import {LinksCtrl} from '../controllers/LinksCtrl'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.get('/links/:spaceId', auth, mapRoute(LinksCtrl, 'listAll'))
router.get('/links/view/:id', [auth, authorize(Objects.Link, Actions.Read)], mapRoute(LinksCtrl, 'view'))
router.post('/links', auth, mapRoute(LinksCtrl, 'create'))
router.patch('/links/:id', auth, mapRoute(LinksCtrl, 'update'))
router.delete('/links/:id', auth, mapRoute(LinksCtrl, 'delete'))

export { router as linkRouter }
