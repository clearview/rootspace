export * from './Room'
export * from './RoomType'
export * from './RoomEntityName'
export * from './WsInMessage'

export function appRooName(): string {
  return 'app'
}

export function spaceRoomName(spaceId: number): string {
  return 'space.' + spaceId
}

export function entityRoomName(spaceId: number, entityName: string, entityId?: number) {
  let name = 'space.' + spaceId + '.' + entityName

  if (entityId) {
    name += '.' + entityId
  }

  return name
}
