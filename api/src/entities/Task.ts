import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn} from 'typeorm'

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
  attacments: object

  @Column('timestamp', { nullable: true })
  dueDate: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

}