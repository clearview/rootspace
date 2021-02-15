import { IActivity } from '../Activity'
import { ISpaceActivityData } from './SpaceActivityData'
import { ActivityType } from '../types'

export abstract class SpaceActivity implements IActivity {
  protected _action: string
  protected _actorId: number
  protected _spaceId: number
  protected _entityId: number
  protected _entity: string
  protected _context: any

  constructor(action: string, spaceId: number, actorId?: number) {
    this._action = action
    this._spaceId = spaceId
    this._actorId = actorId
  }

  getHandler(): string | null {
    return null
  }

  getType() {
    return ActivityType.Space
  }

  toObject(): ISpaceActivityData {
    return {
      actorId: this._actorId,
      spaceId: this._spaceId,
      entityId: this._entityId,
      entity: this._entity,
      action: this._action,
      type: this.getType(),
      context: this._context,
      handler: this.getHandler(),
    }
  }
}
