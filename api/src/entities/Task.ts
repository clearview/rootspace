import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { TaskList } from './TaskList'

export enum TaskStatus {
  Open = 0,
  Closed = 1
}

@Entity('tasks')
export class Task {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('uuid')
  @Index()
  listId: string

  @Column('json', { nullable: true })
  assignedTo: object

  @Column('varchar')
  title: string

  @Column('text', { nullable: true })
  description: string

  @Column('integer', { nullable: true })
  status: TaskStatus

  @Column('json', { nullable: true })
  tags: object

  @Column('json', { nullable: true })
  attachments: object

  @Column('timestamp', { nullable: true })
  dueDate: string

  @Column('integer', { default: 0 })
  position: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @ManyToOne(type => TaskList, list => list.tasks)
  list: TaskList

}