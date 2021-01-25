import api from '@/utils/api'

export interface ActivitySpaceParams {
  offset?: number;
  limit?: number;
  userId?: number;
  action?: string;
  type?: string;
  entity?: string;
}

export default class ActivityService {
  static async bySpace (spaceId: number, params: ActivitySpaceParams = {}) {
    const res = await api.get('activities/space/' + spaceId, {
      params: {
        offset: 0,
        limit: 10,
        type: 'content',
        ...params
      }
    })

    return res.data.data
  }
}
