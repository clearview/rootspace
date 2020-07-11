import { EntityMetadata } from 'typeorm/metadata/EntityMetadata'

export interface FollowableInterface<Entity = any> {
    onCreated(entity: Entity, metaData: EntityMetadata): Promise<void>
    onUpdated(entity: Entity, metaData: EntityMetadata): Promise<void>
    onDeleted?(): Promise<void>
}