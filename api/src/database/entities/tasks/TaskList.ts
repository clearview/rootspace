import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne, JoinColumn
} from 'typeorm'
import { User } from '../User'
import { Space } from '../Space'
import { Task } from './Task'
import { TaskBoard } from './TaskBoard'

@Entity('task_lists')
export class TaskList {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @ManyToOne((type) => User)
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

  @ManyToOne(type => TaskBoard, board => board.taskLists, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'boardId' })
  @Index()
  board!: TaskBoard

  @Column('varchar')
  title: string

  @Column('text', { nullable: true })
  description: string

  @Column('double precision', { default: 0 })
  position: number

  @Column('json', { default: {} })
  settings: object

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @OneToMany(type => Task, task => task.list, {eager: false, onDelete: 'CASCADE'})
  tasks: Task[]

}