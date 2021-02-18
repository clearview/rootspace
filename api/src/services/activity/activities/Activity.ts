import { IActivityData } from './ActivityData'

export interface IActivity {
  type(): string
  toObject(): IActivityData
}

export abstract class Activity {
  protected _action: string
  protected _actorId: number
  protected _spaceId: number
  protected _entityId: number
  protected _entity: string
  protected _context: any

  protected _config = {
    push: false,
    persist: false,
    handler: null,
  }

  constructor(action: string) {
    this._action = action
  }

  abstract type(): string
  abstract push(): boolean
  abstract persist(): boolean
  abstract handler(): string

  toObject(): IActivityData {
    return {
      action: this._action,
      actorId: this._actorId,
      spaceId: this._spaceId,
      entityId: this._entityId,
      entity: this._entity,
      context: this._context,
      type: this.type(),
      handler: this.handler(),
    }
  }
}
