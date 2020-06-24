import { auth, authorize, Objects } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import {TaskBoardCtrl, TaskCtrl, TaskListCtrl} from '../controllers/tasks'
import PromiseRouter from 'express-promise-router'
import {TaskCommentCtrl} from '../controllers/tasks'

const router = PromiseRouter()

router.get('/tasks/board/:id', [auth, authorize(Objects.TaskBoard)], mapRoute(TaskBoardCtrl, 'view'))
router.post('/tasks/board', [auth, authorize(Objects.TaskBoard)], mapRoute(TaskBoardCtrl, 'create'))
router.patch('/tasks/board/:id', [auth, authorize(Objects.TaskBoard)], mapRoute(TaskBoardCtrl, 'update'))
router.delete('/tasks/board/:id', [auth, authorize(Objects.TaskBoard)], mapRoute(TaskBoardCtrl, 'delete'))

router.get('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'view'))
router.post('/tasks/list', auth, mapRoute(TaskListCtrl, 'create'))
router.patch('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'update'))
router.delete('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'delete'))

router.get('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'view'))
router.post('/tasks/task', auth, mapRoute(TaskCtrl, 'create'))
router.patch('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'update'))
router.delete('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'delete'))

router.get('/tasks/comment/:id', auth, mapRoute(TaskCommentCtrl, 'view'))
router.post('/tasks/comment', auth, mapRoute(TaskCommentCtrl, 'create'))
router.patch('/tasks/comment/:id', auth, mapRoute(TaskCommentCtrl, 'update'))
router.delete('/tasks/comment/:id', auth, mapRoute(TaskCommentCtrl, 'delete'))

export { router as taskRouter }
