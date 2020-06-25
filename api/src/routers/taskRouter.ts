import { authenticate, authorize, Objects } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { TaskBoardCtrl, TaskBoardTagCtrl, TaskListCtrl , TaskCtrl, TaskCommentCtrl } from '../controllers/tasks'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

// Task Board
router.get('/tasks/board/:id', authorize(Objects.TaskBoard), mapRoute(TaskBoardCtrl, 'view'))
router.post('/tasks/board', authorize(Objects.TaskBoard), mapRoute(TaskBoardCtrl, 'create'))
router.patch('/tasks/board/:id', authorize(Objects.TaskBoard), mapRoute(TaskBoardCtrl, 'update'))
router.delete('/tasks/board/:id', authorize(Objects.TaskBoard), mapRoute(TaskBoardCtrl, 'delete'))

router.get('/tasks/board/:id/tags', mapRoute(TaskBoardTagCtrl, 'list'))
router.get('/tasks/board/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'view'))
router.post('/tasks/board/:id:/tags', mapRoute(TaskBoardTagCtrl, 'create'))
router.patch('/tasks/board/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'update'))
router.delete('/tasks/board/:id/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'delete'))

// Task List
router.get('/tasks/list/:id', mapRoute(TaskListCtrl, 'view'))
router.post('/tasks/list', mapRoute(TaskListCtrl, 'create'))
router.patch('/tasks/list/:id', mapRoute(TaskListCtrl, 'update'))
router.delete('/tasks/list/:id', mapRoute(TaskListCtrl, 'delete'))

// Task
router.get('/tasks/task/:id', mapRoute(TaskCtrl, 'view'))
router.post('/tasks/task', mapRoute(TaskCtrl, 'create'))
router.patch('/tasks/task/:id', mapRoute(TaskCtrl, 'update'))
router.delete('/tasks/task/:id', mapRoute(TaskCtrl, 'delete'))

router.post('/tasks/task/:id/assignee/:userId/add', mapRoute(TaskCtrl, 'assigneeAdd'))
router.post('/tasks/task/:id/assignee/:userId/remove', mapRoute(TaskCtrl, 'assigneeRemove'))

// Todo: Add task tag routes
// router.post('/tasks/task/:id/tag/:tagId/add', auth, mapRoute(TaskCtrl, 'tagAdd'))
// router.post('/tasks/task/:id/tag/:tagId/remove', auth, mapRoute(TaskCtrl, 'tagRemove'))

// Todo: Check task comments controller actions
router.get('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'view'))
router.post('/tasks/comment', mapRoute(TaskCommentCtrl, 'create'))
router.patch('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'update'))
router.delete('/tasks/comment/:id', mapRoute(TaskCommentCtrl, 'delete'))

export { router as taskRouter }
