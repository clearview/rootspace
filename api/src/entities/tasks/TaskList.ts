import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne
} from 'typeorm'
import { Task } from './Task'
import {TaskBoard} from './TaskBoard'

@Entity('task_lists')
export class TaskList {

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
  boardId: number

  @Column('varchar')
  title: string

  @Column('text', { nullable: true })
  description: string

  @Column('double precision', { default: 0 })
  position: number

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @ManyToOne(type => TaskBoard, board => board.taskLists, {onDelete: 'CASCADE'})
  board: TaskBoard

  @OneToMany(type => Task, task => task.list, {eager: true})
  tasks: Task[]

}