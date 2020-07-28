import { getConnection } from 'typeorm'

export class ActivityEvent {
  private readonly _action: string
  private _actorId: number
  private _spaceId: number
  private _itemId: number
  private _targetName: string
  private _tableName: string

  private constructor(action: string) {
    this._action = action
  }

  public static withAction(action: string): ActivityEvent {
    return new ActivityEvent(action)
  }

  fromActor(actorId: number): ActivityEvent {
    this._actorId = actorId
    return this
  }

  forEntity(entity: any): ActivityEvent {
    this._itemId = entity.id
    this._targetName = entity.constructor.name
    this._tableName = getConnection().getMetadata(this._targetName).tableName
    return this
  }

  inSpace(spaceId: number): ActivityEvent {
    this._spaceId = spaceId
    return this
  }

  get action(): string {
    return this._action
  }

  get actorId(): number {
    return this._actorId
  }

  get spaceId(): number {
    return this._spaceId
  }

  get itemId(): number {
    return this._itemId
  }

  get targetName(): string {
    return this._targetName
  }

  get tableName(): string {
    return this._tableName
  }

  toObject(): object {
    return {
      action: this.action,
      actorId: this._actorId,
      spaceId: this.spaceId,
      itemId: this.itemId,
      targetName: this.targetName,
      tableName: this.tableName,
    }
  }
}