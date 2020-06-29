import { authenticate, authorize, Objects } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import {TaskBoardCtrl, TaskCtrl, TaskListCtrl} from '../controllers/tasks'
import PromiseRouter from 'express-promise-router'
import {TaskCommentCtrl} from '../controllers/tasks'

const router = PromiseRouter()
router.use(authenticate)

router.get('/tasks/board/:id', authorize(Objects.TaskBoard), mapRoute(TaskBoardCtrl, 'view'))
router.post('/tasks/board', authorize(Objects.TaskBoard), mapRoute(TaskBoardCtrl, 'create'))
router.patch('/tasks/board/:id', authorize(Objects.TaskBoard), mapRoute(TaskBoardCtrl, 'update'))
router.delete('/tasks/board/:id', authorize(Objects.TaskBoard), mapRoute(TaskBoardCtrl, 'delete'))

router.get('/tasks/list/:id', mapRoute(TaskListCtrl, 'view'))
router.post('/tasks/list', mapRoute(TaskListCtrl, 'create'))
router.patch('/tasks/list/:id', mapRoute(TaskListCtrl, 'update'))
router.delete('/tasks/list/:id', mapRoute(TaskListCtrl, 'delete'))

router.get('/tasks/task/:id', mapRoute(TaskCtrl, 'view'))
router.post('/tasks/task', mapRoute(TaskCtrl, 'create'))
router.patch('/tasks/task/:id', mapRoute(TaskCtrl, 'update'))
router.delete('/tasks/task/:id', mapRoute(TaskCtrl, 'delete'))

router.get('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'view'))
router.post('/tasks/comment', mapRoute(TaskCommentCtrl, 'create'))
router.patch('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'update'))
router.delete('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'delete'))

export { router as taskRouter }
