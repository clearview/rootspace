export * from './Room'
export * from './RoomType'

export function appRooName(): string {
  return 'app'
}

export function spaceRoomName(spaceId: number): string {
  return 'space.' + spaceId
}

export function entityRoomName(spaceId: number, entityName: string) {
  return 'space.' + spaceId + '.' + entityName
}
