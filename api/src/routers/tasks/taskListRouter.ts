import { authenticate } from '../../middleware/AuthMiddleware'
import { mapRoute } from '../../utils'
import { TaskListCtrl } from '../../controllers/tasks'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/tasks/list/:id', mapRoute(TaskListCtrl, 'view'))
router.post('/tasks/list', mapRoute(TaskListCtrl, 'create'))
router.patch('/tasks/list/:id', mapRoute(TaskListCtrl, 'update'))
router.delete('/tasks/list/:id', mapRoute(TaskListCtrl, 'delete'))

export { router as taskListRouter }
