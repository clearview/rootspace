import { IActivityData } from './ActivityData'
import { IActivityObject } from './ActivityObject'

export abstract class Activity {
  protected _action: string
  protected _actorId: number
  protected _spaceId: number
  protected _entityId: number
  protected _entityName: string
  protected _context: any

  constructor(action: string) {
    this._action = action
  }

  abstract type(): string

  abstract push(): boolean

  pushTo(): string {
    return null
  }

  abstract persist(): boolean

  abstract handler(): string

  toObject(): IActivityObject {
    return this._toObject()
  }

  data(): IActivityData {
    return this._data()
  }

  private _toObject(): IActivityObject {
    return {
      push: this.push(),
      pushTo: this.pushTo(),
      persist: this.persist(),
      handler: this.handler(),
      data: this._data(),
    }
  }

  private _data(): IActivityData {
    return {
      action: this._action,
      actorId: this._actorId,
      spaceId: this._spaceId,
      entityId: this._entityId,
      entity: this._entityName,
      context: this._context,
      type: this.type(),
    }
  }
}
