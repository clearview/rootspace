import { TaskBoardResource, TaskBoardType, TaskItemResource, TaskItemStatus, TaskListResource } from '@/types/resource'
import api from '@/utils/api'

export interface ApiResponse<T>{
  data: T;
}
export interface ApiService<T, TFetch> {
  fetch(params: TFetch): Promise<T[]>;

  create(data: T): Promise<T>;

  view(id: number): Promise<ApiResponse<T> | null>;

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

function createService<T, TFetch> (url: string): ApiService<T, TFetch> {
  return new class implements ApiService<T, TFetch> {
    async create (data: T): Promise<T> {
      const res = await api.post(url, { data })
      return res.data
    }

    destroy (id: number): Promise<void> {
      return Promise.resolve(undefined)
    }

    fetch (params: TFetch): Promise<T[]> {
      return Promise.resolve([])
    }

    move (parentId: number, entryId: number, position: number): Promise<void> {
      return Promise.resolve(undefined)
    }

    update (id: number, data: T): Promise<T> {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return Promise.resolve(undefined)
    }

    async view (id: number): Promise<ApiResponse<T> | null> {
      const res = await api.get(`${url}/${id}`)
      return res.data
    }
  }()
}

export const BoardService = createService<TaskBoardResource, BoardFetchParams>('tasks/board')
