import { IActivity } from '../Activity'
import { IActivityData } from '../ActivityData'
import { ActivityType } from '../types'

export abstract class AppActivity implements IActivity {
  protected _action: string
  protected _actorId: number
  protected _spaceId: number
  protected _entityId: number
  protected _entity: string
  protected _context: any

  constructor(action: string, entity: string, entityId: number, actorId?: number) {
    this._action = action
    this._entity = entity
    this._entityId = entityId
    this._actorId = actorId
  }

  protected getHandler(): string | null {
    return null
  }

  getType() {
    return ActivityType.App
  }

  toObject(): IActivityData {
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
