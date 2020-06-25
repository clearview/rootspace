import auth from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { TaskBoardCtrl, TaskBoardTagCtrl, TaskListCtrl, TaskCtrl, TaskCommentCtrl } from '../controllers/tasks'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

// Task Board
router.get('/tasks/board/:id', auth, mapRoute(TaskBoardCtrl, 'view'))
router.post('/tasks/board', auth, mapRoute(TaskBoardCtrl, 'create'))
router.patch('/tasks/board/:id', auth, mapRoute(TaskBoardCtrl, 'update'))
router.delete('/tasks/board/:id', auth, mapRoute(TaskBoardCtrl, 'delete'))

router.get('/tasks/board/:taskBoardId/tags', auth, mapRoute(TaskBoardTagCtrl, 'list'))
router.post('/tasks/board/:taskBoardId/tags', auth, mapRoute(TaskBoardTagCtrl, 'create'))
router.get('/tasks/board/tags/:tagId', auth, mapRoute(TaskBoardTagCtrl, 'view'))
router.patch('/tasks/board/tags/:tagId', auth, mapRoute(TaskBoardTagCtrl, 'update'))
router.delete('/tasks/board/tags/:tagId', auth, mapRoute(TaskBoardTagCtrl, 'delete'))

// Task List
router.get('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'view'))
router.post('/tasks/list', auth, mapRoute(TaskListCtrl, 'create'))
router.patch('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'update'))
router.delete('/tasks/list/:id', auth, mapRoute(TaskListCtrl, 'delete'))

// Task
router.get('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'view'))
router.post('/tasks/task', auth, mapRoute(TaskCtrl, 'create'))
router.patch('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'update'))
router.delete('/tasks/task/:id', auth, mapRoute(TaskCtrl, 'delete'))

router.post('/tasks/task/:id/assignee/:userId/add', auth, mapRoute(TaskCtrl, 'assigneeAdd'))
router.post('/tasks/task/:id/assignee/:userId/remove', auth, mapRoute(TaskCtrl, 'assigneeRemove'))

router.post('/tasks/task/:id/tag/:tagId/add', auth, mapRoute(TaskCtrl, 'tagAdd'))
router.post('/tasks/task/:id/tag/:tagId/remove', auth, mapRoute(TaskCtrl, 'tagRemove'))

router.get('/tasks/comment/:id', auth, mapRoute(TaskCommentCtrl, 'view'))
router.post('/tasks/comment', auth, mapRoute(TaskCommentCtrl, 'create'))
router.patch('/tasks/comment/:id', auth, mapRoute(TaskCommentCtrl, 'update'))
router.delete('/tasks/comment/:id', auth, mapRoute(TaskCommentCtrl, 'delete'))

export { router as taskRouter }
