import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { TaskList } from './TaskList'

@Entity('tasks')
export class Task {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('integer')
  @Index()
  listId: number

  @Column('json')
  assignedTo: object

  @Column('varchar')
  title: string

  @Column('text')
  description: string

  @Column('integer')
  status: number

  @Column('json', { nullable: true })
  tags: object

  @Column('json', { nullable: true })
  attachments: object

  @Column('timestamp', { nullable: true })
  dueDate: string

  @Column('integer')
  order: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @ManyToOne(type => TaskList, list => list.tasks)
  list: TaskList

}