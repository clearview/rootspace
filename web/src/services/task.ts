
import { TaskResource } from '@/types/resource'

export interface FetchParams {
  spaceId: number;
  limit: number;
  offset: number;
  sort: {
    [field: string]: string;
  };
}

const backend: TaskResource[] = [{
  id: 0,
  name: 'Groceries',
  type: 'list',
  config: {
    private: false
  },
  spaceId: 1
}]
let idGen = 1
// TODO Replace with API calls
export default class TaskService {
  static async fetch ({ spaceId, ...params }: FetchParams) { // eslint-disable-line
    return backend
  }

  static async create (data: TaskResource) {
    data.id = idGen++
    backend.push(data)
  }

  static async view (id: number) {
    return backend.find(task => task.id === id)
  }

  static async update (id: number, data: TaskResource) {
    backend.forEach(task => {
      if (task.id === id) {
        task.name = data.name
        task.config = data.config
        task.type = data.type
        task.spaceId = data.spaceId
        task.children = data.children
      }
    })
  }

  static async destroy (id: number) {
    const index = backend.findIndex(task => task.id === id)
    delete backend[index]
  }
}
