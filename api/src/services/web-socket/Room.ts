import { RoomType } from './RoomType'
import { RoomEntityName } from './RoomEntityName'

export class Room {
  name: string
  type: string
  spaceId: number
  entityName: string
  entityId: number

  constructor(roomName: string) {
    this.name = roomName
    this.init()
  }

  getName(): string {
    return this.name
  }

  getType(): string {
    return this.type
  }

  getSpaceId(): number | null {
    return this.spaceId
  }

  private init() {
    const parts = this.name.split('.')

    this.type = this.parseType(parts)

    if (this.type === RoomType.Space) {
      this.spaceId = this.parseSpaceId(parts[1])
      return
    }

    if (this.type === RoomType.Entity) {
      this.spaceId = this.parseSpaceId(parts[1])
      this.entityName = this.parseEntityName(parts[2])

      if (parts.length === 4) {
        this.entityId = this.parseEntityId(parts[3])
      }
    }
  }

  private parseType(parts: string[]): string | null {
    if (parts[0] === RoomType.App && parts.length === 1) {
      return RoomType.App
    }

    if (parts[0] === RoomType.Space && parts.length === 2) {
      return RoomType.Space
    }

    if (parts.length === 3 || parts.length === 4) {
      return RoomType.Entity
    }

    throw Error('Invalid room name')
  }

  private parseSpaceId(spaceId: string): number {
    const id = Number(spaceId)
    if (id) {
      return id
    }

    throw Error('Invalid room name')
  }

  private parseEntityName(name: string): string {
    for (const key in RoomEntityName) {
      if (Object.prototype.hasOwnProperty.call(RoomEntityName, key)) {
        if (name === RoomEntityName[key]) {
          return name
        }
      }
    }

    throw Error('Invalid room name')
  }

  private parseEntityId(value: string): number {
    const id = Number(value)

    if (isNaN(id) === true) {
      throw Error('Invalid entity id')
    }

    return id
  }
}
