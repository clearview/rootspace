import { IActivityData } from './ActivityData'

export interface IActivity {
  getType(): string
  toObject(): IActivityData
}

export abstract class Activity {
  protected _action: string
  protected _actorId: number
  protected _spaceId: number
  protected _entityId: number
  protected _entity: string
  protected _context: any

  protected _push: boolean = false
  protected _persist: boolean = false
  protected _handler: string = null

  push(): boolean {
    return this._push
  }

  persist(): boolean {
    return this._persist
  }

  handler(): string {
    return this._handler
  }

  abstract type(): string

  toObject(): IActivityData {
    return {
      action: this._action,
      actorId: this._actorId,
      spaceId: this._spaceId,
      entityId: this._entityId,
      entity: this._entity,
      type: this.type(),
      context: this._context,
      handler: this._handler,
    }
  }
}
