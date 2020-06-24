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

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User

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