import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'
import { Space } from './Space'


@Entity()
export class UserToSpace {

    @PrimaryGeneratedColumn()
    public id!: number

    @Column()
    @Index()
    public userId!: number

    @Column()
    @Index()
    public spaceId!: number

    @ManyToOne(type => User, user => user.id)
    public user!: User

    @ManyToOne(type => Space, space => space.id)
    public space!: Space

}