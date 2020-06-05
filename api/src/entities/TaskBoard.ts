import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { TaskList } from './TaskList'

export enum TaskBoardType {
  List = 1,
  Kanban = 2
}

@Entity('task_boards')
export class TaskBoard {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('integer')
  type: TaskBoardType

  @Column('boolean', { default: false })
  isPublic: boolean

  @Column('varchar')
  title: string

  @Column('text', { nullable: true })
  description: string

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @OneToMany(type => TaskList, taskList => taskList.board)
  taskLists: TaskList[]
}