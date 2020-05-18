import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Task } from './Task'

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
  groupId: number

  @Column('varchar')
  title: string

  @Column('text')
  description: string

  @Column('integer')
  countTasks: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @OneToMany(type => Task, task => task.list)
  tasks: Task[]

}