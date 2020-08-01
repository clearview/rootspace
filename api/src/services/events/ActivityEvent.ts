import { getConnection } from 'typeorm'

export enum EntityType {
  Doc = 'Doc',
  Node = 'Node',
  Task = 'Task',
  TaskBoard = 'TaskBoard',
  TaskList = 'TaskList',
  Upload = 'Upload',
}

export class ActivityEvent {
  private readonly _action: string
  private _actorId: number
  private _userId?: number
  private _spaceId: number
  private _entityId: number
  private _entity: string
  private _tableName: string
  private _data: string

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
    this._data = entity

    this._entityId = entity.id
    this._entity = entity.constructor.name
    this._tableName = getConnection().getMetadata(this._entity).tableName
    return this
  }

  inSpace(spaceId: number): ActivityEvent {
    this._spaceId = spaceId
    return this
  }

  get action(): string {
    return this._action
  }

  get userId(): number {
    return this._userId
  }

  set userId(value: number) {
    this._userId = value
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

  get entity(): string {
    return this._entity
  }

  get tableName(): string {
    return this._tableName
  }

  get data(): string {
    return this._data
  }

  toObject(): object {
    return {
      action: this.action,
      actorId: this._actorId,
      spaceId: this.spaceId,
      entityId: this.entityId,
      entity: this.entity,
      tableName: this.tableName,
      data: this.data
    }
  }
}