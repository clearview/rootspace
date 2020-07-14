import
{ EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { Notification } from '../entities/Notification'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {}
