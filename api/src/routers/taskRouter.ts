import { authenticate, authorize, Subjects } from '../middleware/AuthMiddleware'
import { mapRoute } from '../utils'
import { TaskBoardCtrl, TaskBoardTagCtrl, TaskListCtrl , TaskCtrl, TaskCommentCtrl } from '../controllers/tasks'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()
router.use(authenticate)

// Task Board
router.get('/tasks/board/:id', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'view'))
router.get('/tasks/board/:id/archived', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'viewArchivedTasks'))
router.get('/tasks/board/task/:id', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'viewByTaskId'))
router.post('/tasks/board', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'create'))
router.post('/tasks/board/:id/search', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'searchTasks'))
router.patch('/tasks/board/:id', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'update'))
router.delete('/tasks/board/:id', authorize(Subjects.TaskBoard), mapRoute(TaskBoardCtrl, 'delete'))

router.get('/tasks/board/:taskBoardId/tags', mapRoute(TaskBoardTagCtrl, 'list'))
router.post('/tasks/board/:taskBoardId/tags', mapRoute(TaskBoardTagCtrl, 'create'))
router.get('/tasks/board/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'view'))
router.patch('/tasks/board/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'update'))
router.delete('/tasks/board/tags/:tagId', mapRoute(TaskBoardTagCtrl, 'delete'))

// Task List
router.get('/tasks/list/:id', mapRoute(TaskListCtrl, 'view'))
router.post('/tasks/list', mapRoute(TaskListCtrl, 'create'))
router.patch('/tasks/list/:id', mapRoute(TaskListCtrl, 'update'))
router.delete('/tasks/list/:id', mapRoute(TaskListCtrl, 'delete'))

// Task
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
