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

  @Column('json', { default: [], nullable: true })
  tags: object

  @Column('json', { nullable: true })
  attachments: object

  @Column( 'timestamptz', { nullable: true })
  dueDate: Date

  @Column('integer', { default: 0 })
  position: number

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @ManyToOne(type => TaskList, list => list.tasks)
  list: TaskList

}