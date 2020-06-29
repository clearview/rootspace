import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany, ManyToMany, JoinTable, JoinColumn, Index
} from 'typeorm'
import { TaskList } from './TaskList'
import { TaskComment } from './TaskComment'
import { User } from '../User'
import { Tag } from './Tag'
import { Space } from '../Space'

export enum TaskStatus {
  Open = 0,
  Closed = 1
}

@Entity('tasks')
export class Task {

  @PrimaryGeneratedColumn()
  id: number
  @Column('integer')
  @Index()
  userId: number

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User

  @Column('integer')
  @Index()
  spaceId: number

  @ManyToOne((type) => Space)
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space!: Space

  @Column('integer')
  @Index()
  listId: number

  @ManyToOne(type => TaskList, list => list.tasks, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'listId' })
  @Index()
  list!: TaskList

  @Column('varchar')
  title: string

  @Column('text', { nullable: true })
  description: string

  @Column('integer', { nullable: true })
  status: TaskStatus

  @Column('json', { nullable: true })
  attachments: object

  @Column( 'timestamptz', { nullable: true })
  dueDate: Date

  @Column('double precision', { default: 0 })
  position: number

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @OneToMany(type => TaskComment, taskComment => taskComment.task, {eager: true})
  taskComments: TaskComment[]

  @ManyToMany(type => User, {cascade: true, eager: true})
  @JoinTable()
  assignees: User[]

  @ManyToMany(type => Tag, {eager: true})
  @JoinTable()
  tags: Tag[]
}