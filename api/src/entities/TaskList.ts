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
  boardId: string

  @Column('varchar')
  title: string

  @Column('text', { nullable: true })
  description: string

  @Column('integer', { default: 0 })
  position: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @ManyToOne(type => TaskBoard, board => board.taskLists)
  board: TaskBoard

  @OneToMany(type => Task, task => task.list)
  tasks: Task[]

}