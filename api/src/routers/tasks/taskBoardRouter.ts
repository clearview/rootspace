import { authenticate, authorize, Subjects } from '../../middleware/AuthMiddleware'
import { mapRoute } from '../../utils'
import { TaskBoardCtrl, TaskBoardTagCtrl } from '../../controllers/tasks'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/tasks/board/:id', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'view'))
router.get('/tasks/board/task/:id', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'viewByTaskId'))
router.post('/tasks/board', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'create'))
router.post('/tasks/board/:id/search', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'searchTasks'))
router.patch('/tasks/board/:id', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'update'))
router.post('/tasks/board/:id/archive', mapRoute(TaskBoardCtrl, 'archive'))
router.post('/tasks/board/:id/restore', mapRoute(TaskBoardCtrl, 'restore'))
router.delete('/tasks/board/:id', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'delete'))

router.get('/tasks/board/:taskBoardId/tags', mapRoute(TaskBoardTagCtrl, 'list'))
router.post('/tasks/board/:taskBoardId/tags', mapRoute(TaskBoardTagCtrl, 'create'))
router.get('/tasks/board/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'view'))
router.patch('/tasks/board/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'update'))
router.delete('/tasks/board/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'delete'))

export { router as taskBoardRouter }
