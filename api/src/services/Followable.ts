import { EntityMetadata } from 'typeorm/metadata/EntityMetadata'
import { User } from '../database/entities/User'

export interface FollowableInterface<Entity = any> {
    onCreated?(user: User, entity: Entity, metaData?: EntityMetadata): Promise<void>
    onUpdated?(user: User, entity: Entity, metaData?: EntityMetadata): Promise<void>
    onDeleted?(user: User, entity: Entity, metaData?: EntityMetadata): Promise<void>
}