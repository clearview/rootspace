import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity('invites')
export class Invite {

    @PrimaryGeneratedColumn()
    id: number

    @Column('integer')
    @Index()
    user_id: string

    @Column('integer')
    @Index()
    space_id: string

    @Column('varchar', { length: 100 })
    @Index()
    email: string

    @Column('boolean', { default: false })
    accepted: boolean

    @CreateDateColumn()
    created: string

    @UpdateDateColumn()
    updated: string

}