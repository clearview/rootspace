import { TaskBoardResource, TaskBoardType, TaskItemResource, TaskItemStatus, TaskListResource } from '@/types/resource'

export interface ApiService<T, TFetch> {
  fetch(params: TFetch): Promise<T[]>;

  create(data: T): Promise<T>;

  view(id: number): Promise<T | null>;

  update(id: number, data: T): Promise<T>;

  destroy(id: number): Promise<void>;

  move(parentId: number, entryId: number, position: number): Promise<void>;
}

export interface BoardFetchParams {
  spaceId: number;
}

export interface ListFetchParams {
  boardId: number;
}

export interface ItemFetchParams {
  listId: number;
}

const itemBackend: TaskItemResource[] = [{
  position: 0,
  title: 'Hello',
  listId: 0,
  id: 0,
  status: TaskItemStatus.Open,
  assignedTo: null,
  list: null,
  attachments: null,
  createdAt: null,
  description: null,
  dueDate: null,
  spaceId: null,
  tags: null,
  updatedAt: null,
  userId: null
}]

const listBackend: TaskListResource[] = [
  {
    id: 0,
    title: 'To-do',
    position: 0,
    tasks: itemBackend,
    updatedAt: null,
    createdAt: null,
    spaceId: null,
    boardId: 0,
    board: null,
    description: null,
    userId: null
  }
]

let boardBackend: TaskBoardResource[] = [{
  id: 0,
  title: 'Groceries',
  type: TaskBoardType.Kanban,
  isPublic: true,
  taskLists: [],
  spaceId: 1,
  createdAt: null,
  updatedAt: null,
  description: null,
  userId: null,
  uuid: null
}]

let idGen = 1

// TODO Replace with API calls
export class TaskBoardService implements ApiService<TaskBoardResource, BoardFetchParams> {
  async fetch ({ spaceId }: BoardFetchParams): Promise<TaskBoardResource[]> {
    console.log(`Fetch ${spaceId}`)
    return boardBackend
  }

  async create (data: TaskBoardResource): Promise<TaskBoardResource> {
    data.id = idGen++
    boardBackend.push(data)
    return data
  }

  async view (id: number): Promise<TaskBoardResource | null> {
    return boardBackend.find(task => task.id === id) || null
  }

  async update (id: number, data: TaskBoardResource): Promise<TaskBoardResource> {
    boardBackend = boardBackend.map(board => {
      if (board.id === id) {
        return data
      }
      return board
    })
    return data
  }

  async destroy (id: number): Promise<void> {
    const index = boardBackend.findIndex(task => task.id === id)
    delete boardBackend[index]
  }

  async move (parentId: number, id: number, position: number): Promise<void> {
    // NOT IMPLEMENTED FOR BOARD
  }
}

export class TaskListService implements ApiService<TaskListResource, ListFetchParams> {
  async fetch ({ boardId }: ListFetchParams): Promise<TaskListResource[]> {
    console.log(`Fetch ${boardId}`)
    return listBackend.filter(list => list.boardId === boardId)
  }

  async create (data: TaskListResource): Promise<TaskListResource> {
    const targetBoard = boardBackend.find(board => board.id === data.boardId)
    if (targetBoard) {
      data.id = idGen++
      targetBoard.taskLists.push(data)
    }
    return data
  }

  async view (id: number): Promise<TaskListResource | null> {
    return listBackend.find(task => task.id === id) || null
  }

  async update (id: number, data: TaskListResource): Promise<TaskListResource> {
    const targetBoard = boardBackend.find(board => board.id === data.boardId)
    if (targetBoard) {
      targetBoard.taskLists = targetBoard.taskLists.map(list => {
        if (list.id === id) {
          return data
        }
        return list
      })
      return data
    }
    return data
  }

  async destroy (id: number): Promise<void> {
    const index = listBackend.findIndex(list => list.id === id)
    delete listBackend[index]
  }

  async move (parentId: number, id: number, position: number): Promise<void> {
    const original = boardBackend[0].taskLists.find(list => list.id === id)
    boardBackend[0].taskLists = boardBackend[0].taskLists.map(list => {
      const lastPos = list.position
      if (list.id === id) {
        list.position = position
      } else if (list.position <= position && list.id !== id) {
        if (position === 0) {
          list.position++
        } else {
          list.position--
        }
      } else if (list.position >= position && list.id !== id) {
        if (position === boardBackend[0].taskLists.length) {
          list.position--
        } else {
          list.position++
        }
      }
      return list
    })
  }
}

export class TaskItemService implements ApiService<TaskItemResource, ItemFetchParams> {
  async fetch ({ listId }: ItemFetchParams): Promise<TaskItemResource[]> {
    console.log(`Fetch ${listId}`)
    return itemBackend.filter(item => item.listId === listId)
  }

  async create (data: TaskItemResource): Promise<TaskItemResource> {
    const targetBoard = boardBackend.find(board => board.id === data.list?.boardId)
    if (targetBoard) {
      const targetList = targetBoard.taskLists.find(list => list.id === data.listId)
      if (targetList) {
        data.id = idGen++
        targetList.tasks.push(data)
      }
    }
    return data
  }

  async view (id: number): Promise<TaskItemResource | null> {
    return itemBackend.find(task => task.id === id) || null
  }

  async update (id: number, data: TaskItemResource): Promise<TaskItemResource> {
    const targetBoard = boardBackend.find(board => board.id === data.list?.boardId)
    if (targetBoard) {
      const targetList = listBackend.find(list => list.id === data.listId)
      if (targetList) {
        targetList.tasks = targetList.tasks.map(item => {
          if (item.id === id) {
            return data
          }
          return item
        })
        return data
      }
    }
    return data
  }

  async destroy (id: number): Promise<void> {
    console.log(`Delete ${id}`)
    const taskData = boardBackend[0].taskLists.reduce((prev: any, next) => {
      const data = next.tasks.reduce((prevTask: any, nextTask) => {
        if (nextTask.id === id) {
          return nextTask
        }
        return prevTask
      }, null)
      if (data) {
        return data
      }
      return prev
    }, null)
    console.log(taskData)
    if (taskData) {
      const list = boardBackend[0].taskLists.find(list => list.id === taskData.listId)
      if (list) {
        list.tasks = list.tasks.filter(item => item.id !== id)
      }
    }
  }

  async move (parentId: number, id: number, position: number): Promise<void> {
    const taskData = boardBackend[0].taskLists.reduce((prev: any, next) => {
      const data = next.tasks.reduce((prevTask: any, nextTask) => {
        if (nextTask.id === id) {
          return nextTask
        }
        return prevTask
      }, null)
      if (data) {
        return data
      }
      return prev
    }, null)

    if (taskData) {
      const currentParent = boardBackend[0].taskLists.find(list => list.id === taskData.listId)
      const oldPos = taskData.position
      if (currentParent && currentParent.id === parentId) {
        currentParent.tasks = currentParent.tasks.map(item => {
          const lastPos = item.position
          if (item.id === id) {
            item.position = position
          } else if (oldPos < position) {
            if (item.position <= position && item.position > oldPos) {
              item.position--
            }
          } else if (oldPos > position) {
            if (item.position >= position && item.position < oldPos) {
              item.position++
            }
          }
          return item
        })
      }
    }
  }
}
