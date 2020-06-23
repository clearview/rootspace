import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany, ManyToMany, JoinTable
} from 'typeorm'
import {TaskList} from './TaskList'
import {TaskComment} from './TaskComment'
import {User} from '../User'

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

  @Column('integer')
  @Index()
  spaceId: number

  @Column('integer')
  @Index()
  listId: number

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

  @Column('double precision', { default: 0 })
  position: number

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @ManyToOne(type => TaskList, list => list.tasks, {onDelete: 'CASCADE'})
  list: TaskList

  @OneToMany(type => TaskComment, taskComment => taskComment.task, {eager: true})
  taskComments: TaskComment[]

  @ManyToMany(type => User, {cascade: true, eager: true})
  @JoinTable()
  assignees: User[]
}