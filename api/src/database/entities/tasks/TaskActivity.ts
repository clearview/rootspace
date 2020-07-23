import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn, Index
} from 'typeorm'
import { Task } from './Task'
import { User } from '../User'

export enum TaskActivities {
  Assignee_Added = 'Assignee_Added',
  Assignee_Removed = 'Assignee_Removed',
  Attachment_Created = 'Attachment_Created',
  Attachment_Deleted = 'Attachment_Deleted',
  Comment_Created = 'Comment_Created',
  Comment_Updated = 'Comment_Updated',
  Comment_Deleted = 'Comment_Deleted',
  Tag_Added = 'Tag_Added',
  Tag_Removed = 'Tag_Removed',
  Task_Archived = 'Task_Archived',
  Task_Created = 'Task_Created',
  Task_Restored = 'Task_Restored',
  Task_Updated = 'Task_Updated',
  Task_Deleted = 'Task_Deleted'
}

@Entity('task_activities')
export class TaskActivity {

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

  @ManyToOne(type => Task, task => task.taskActivities, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'taskId' })
  @Index()
  task: Task

  @Column('text')
  content!: string

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date
}