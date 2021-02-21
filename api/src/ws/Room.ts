import { RoomEntity } from './RoomEntity'
import { RoomType } from './RoomType'

type ValueOfRoomType<T> = T[keyof T]
// ValueOfRoomType<typeof RoomType>

export class Room {
  name: string
  type: string
  spaceId: number
  entityName: string

  constructor(roomName: string) {
    this.name = roomName
    this.init()
  }

  getName(): string {
    return this.name
  }

  getType(): ValueOfRoomType<typeof RoomType> {
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
    }
  }

  private parseType(parts: string[]): string | null {
    console.log(parts.length)

    if (parts[0] === RoomType.App && parts.length === 1) {
      return RoomType.App
    }

    if (parts[0] === RoomType.Space && parts.length === 2) {
      return RoomType.Space
    }

    if (parts.length === 3) {
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
    for (const key in RoomEntity) {
      if (Object.prototype.hasOwnProperty.call(RoomEntity, key)) {
        if (name === RoomEntity[key]) {
          return name
        }
      }
    }

    throw Error('Invalid room name')
  }
}
