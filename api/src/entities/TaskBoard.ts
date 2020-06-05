import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { TaskList } from './TaskList'

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
  type: number

  @Column('boolean', { default: false })
  public: boolean

  @Column('varchar')
  title: string

  @Column('text', { nullable: true })
  description: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @OneToMany(type => TaskList, taskList => taskList.board)
  lists: TaskList[]
}