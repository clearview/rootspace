import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { UserToSpace } from './UserToSpace'

@Entity('spaces')
export class Space {

    @PrimaryGeneratedColumn()
    id: number

    @Column('integer')
    @Index()
    userId: string

    @Column('varchar', { length: 100 })
    title: string

    @Column('json', { nullable: true })
    settings: object

    @CreateDateColumn()
    created: string

    @UpdateDateColumn()
    updated: string

    @OneToMany(type => UserToSpace, userToSpace => userToSpace.space)
    public userToSpace!: UserToSpace[]

}