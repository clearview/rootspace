import { authenticate } from '../../middleware/AuthMiddleware'
import { mapRoute } from '../../utils'
import { TaskCommentCtrl, TaskCtrl } from '../../controllers/tasks'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

router.get('/tasks/task/:id', mapRoute(TaskCtrl, 'view'))
router.post('/tasks/task', mapRoute(TaskCtrl, 'create'))
router.patch('/tasks/task/:id', mapRoute(TaskCtrl, 'update'))
router.post('/tasks/task/:id/archive', mapRoute(TaskCtrl, 'archive'))
router.post('/tasks/task/:id/restore', mapRoute(TaskCtrl, 'restore'))
router.delete('/tasks/task/:id', mapRoute(TaskCtrl, 'delete'))

router.post('/tasks/task/:id/assignee/:userId/add', mapRoute(TaskCtrl, 'assigneeAdd'))
router.post('/tasks/task/:id/assignee/:userId/remove', mapRoute(TaskCtrl, 'assigneeRemove'))

router.post('/tasks/task/:id/tag/:tagId/add', mapRoute(TaskCtrl, 'tagAdd'))
router.post('/tasks/task/:id/tag/:tagId/remove', mapRoute(TaskCtrl, 'tagRemove'))

router.get('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'view'))
router.post('/tasks/comment', mapRoute(TaskCommentCtrl, 'create'))
router.patch('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'update'))
router.delete('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'delete'))

export { router as taskRouter }
