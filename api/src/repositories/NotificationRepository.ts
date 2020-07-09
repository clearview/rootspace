import
{ EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../database/entities/Notification'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {}
