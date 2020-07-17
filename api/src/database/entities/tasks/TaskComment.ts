import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, Index
} from 'typeorm'
import { Task } from './Task'
import { User } from '../User'

@Entity('task_comments')
export class TaskComment {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'userId'})
  @Index()
  user!: User

  @Column('integer')
  taskId: number

  @ManyToOne(type => Task, task => task.taskComments, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'taskId' })
  @Index()
  task: Task

  @Column('text')
  content!: string

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date
}