import { getConnection } from 'typeorm'

export class ActivityEvent {
  private readonly _action: string
  private _actorId: number
  private _spaceId: number
  private _entityId: number
  private _entityTargetName: string
  private _entityTableName: string

  private constructor(action: string) {
    this._action = action
  }

  public static withAction(action: string): ActivityEvent {
    return new ActivityEvent(action)
  }

  fromUser(userId: number): ActivityEvent {
    this._actorId = userId
    return this
  }

  forEntity(entity: any): ActivityEvent {
    this._entityId = entity.id
    this._entityTargetName = entity.constructor.name
    this._entityTableName = getConnection().getMetadata(this._entityTargetName).tableName
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

  get entityId(): number {
    return this._entityId
  }

  get entityTargetName(): string {
    return this._entityTargetName
  }

  get entityTableName(): string {
    return this._entityTableName
  }

  toObject(): object {
    return {
      action: this.action,
      actorId: this.actorId,
      spaceId: this.spaceId,
      entityId: this.entityId,
      entityTargetName: this.entityTargetName,
      entityTableName: this.entityTableName,
    }
  }
}