import auth from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import {TaskBoardCtrl, TaskCtrl, TaskListCtrl} from '../controllers/tasks'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.get('/tasks/board/:id', auth, mapRoute(TaskBoardCtrl, 'view'))
router.post('/tasks/board', auth, mapRoute(TaskBoardCtrl, 'create'))
router.patch('/tasks/board/:id', auth, mapRoute(TaskBoardCtrl, 'update'))
router.delete('/tasks/board/:id', auth, mapRoute(TaskBoardCtrl, 'delete'))

router.get('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'view'))
router.post('/tasks/list', auth, mapRoute(TaskListCtrl, 'create'))
router.patch('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'update'))
router.delete('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'delete'))

router.get('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'view'))
router.post('/tasks/task', auth, mapRoute(TaskCtrl, 'create'))
router.patch('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'update'))
router.delete('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'delete'))

export { router as taskRouter }
