import { TagResource, TaskBoardResource, TaskCommentResource, TaskItemResource, TaskListResource } from '@/types/resource'
import api from '@/utils/api'

export interface ApiResponse<T> {
  data: T;
}

export interface ApiService<T, TFetch> {
  fetch(params: TFetch): Promise<T[]>;
  create(data: T): Promise<T>;
  view(id: number): Promise<ApiResponse<T> | null>;
  update(id: number, data: T): Promise<T>;
  destroy(id: number): Promise<void>;
  archive(id: number): Promise<void>;
  restore(id: number): Promise<void>;
}

export interface ChildApiService<T, TFetch> {
  fetch(params: TFetch, parentId: number): Promise<T[]>;
  create(data: T, parentId: number): Promise<T>;
  view(id: number, parentId: number): Promise<ApiResponse<T> | null>;
  update(id: number, data: T, parentId: number): Promise<T>;
  destroy(id: number, parentId: number): Promise<void>;
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

export interface CommentFetchParams {
  itemId: number;
}

export interface TagFetchParams {
  boardId: number;
}

function createService<T, TFetch> (url: string): ApiService<T, TFetch> {
  return new class implements ApiService<T, TFetch> {
    async create (data: T): Promise<T> {
      const res = await api.post(url, { data })
      return res.data.data
    }

    async destroy (id: number): Promise<void> {
      await api.delete(`${url}/${id}`)
    }

    async archive (id: number): Promise<void> {
      await api.post(`${url}/${id}/archive`)
    }

    async restore (id: number): Promise<void> {
      await api.post(`${url}/${id}/restore`)
    }

    async fetch (params: TFetch): Promise<T[]> {
      const res = await api.get(url, { params })
      return res.data
    }

    async update (id: number, data: Partial<T>): Promise<T> {
      const res = await api.patch(`${url}/${id}`, { data })
      return res.data.data
    }

    async view (id: number): Promise<ApiResponse<T> | null> {
      const res = await api.get(`${url}/${id}`)
      return res.data
    }
  }()
}

function createChildService<T, TFetch> (url: string): ChildApiService<T, TFetch> {
  return new class implements ChildApiService<T, TFetch> {
    async create (data: T, parentId: number): Promise<T> {
      const res = await api.post(url.replace(':parentId', String(parentId)), { data })
      return res.data
    }

    async destroy (id: number, parentId: number): Promise<void> {
      await api.delete(`${url.replace(':parentId', String(parentId))}/${id}`)
    }

    async fetch (params: TFetch, parentId: number): Promise<T[]> {
      const res = await api.get(url.replace(':parentId', String(parentId)), { params })
      return res.data.data
    }

    async update (id: number, data: Partial<T>, parentId: number): Promise<T> {
      const res = await api.patch(`${url.replace(':parentId', String(parentId))}/${id}`, { data })
      return res.data
    }

    async view (id: number, parentId: number): Promise<ApiResponse<T> | null> {
      const res = await api.get(`${url.replace(':parentId', String(parentId))}/${id}`)
      return res.data
    }
  }()
}

export const BoardService = createService<TaskBoardResource, BoardFetchParams>('tasks/board')
export const ListService = createService<TaskListResource, ListFetchParams>('tasks/list')
export const ItemService = createService<TaskItemResource, ItemFetchParams>('tasks/task')
export const CommentService = createService<TaskCommentResource, CommentFetchParams>('tasks/comment')

export const TagService = createChildService<TagResource, TagFetchParams>('tasks/board/:parentId/tags')
