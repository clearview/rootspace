export class Room {
  spaceId: number
  entityName?: string
  entityId?: number

  private constructor(spaceId: number) {
    this.spaceId = spaceId
  }

  static forSpaceId(spaceId: number): Room {
    return new Room(spaceId)
  }

  withEntity(entityName: string): Room {
    this.entityName = entityName

    return this
  }

  ofId(entityId: number): Room {
    this.entityId = entityId

    return this
  }

  name(): string {
    let name = String(this.spaceId)

    if (this.entityName) {
      name += `.${this.entityName}`
    }

    if (this.entityId) {
      name += `.${this.entityId}`
    }

    return name
  }
}
