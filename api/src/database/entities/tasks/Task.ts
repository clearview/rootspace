import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm'
import { TaskList } from './TaskList'
import { TaskComment } from './TaskComment'
import { User } from '../User'
import { Tag } from './Tag'
import { Space } from '../Space'
import { TaskBoard } from './TaskBoard'
import { Upload } from '../Upload'

export enum TaskStatus {
  Open = 0,
  Closed = 1,
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @ManyToOne(
    (type) => User,
    (user) => user.tasks,
    { eager: true, onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User

  @Column('integer')
  spaceId: number

  @ManyToOne((type) => Space)
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space!: Space

  @Column('integer')
  boardId: number

  @ManyToOne((type) => TaskBoard)
  @JoinColumn({ name: 'boardId' })
  @Index()
  board!: TaskBoard

  @Column('integer')
  listId: number

  @ManyToOne(
    (type) => TaskList,
    (list) => list.tasks,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'listId' })
  @Index()
  list!: TaskList

  @Column('varchar')
  title: string

  @Column('varchar')
  slug: string

  @Column('text', { nullable: true })
  description: string

  @Column('integer', { nullable: true })
  status: TaskStatus

  @Column('timestamptz', { nullable: true })
  dueDate: Date

  @Column('double precision', { default: 0 })
  position: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  public deletedAt: Date

  @OneToMany(
    (type) => TaskComment,
    (taskComment) => taskComment.task,
    { eager: true, onDelete: 'CASCADE' }
  )
  taskComments: TaskComment[]

  @ManyToMany((type) => User, { cascade: true, eager: true })
  @JoinTable()
  assignees: User[]

  @ManyToMany((type) => Tag, { eager: true, onDelete: 'CASCADE' })
  @JoinTable()
  tags: Tag[]
}
