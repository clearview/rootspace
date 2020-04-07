import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity('invites')
export class Invite {

    @PrimaryGeneratedColumn()
    id: number

    @Column('integer')
    @Index()
    userId: string

    @Column('integer')
    @Index()
    spaceId: string

    @Column('varchar', { length: 100 })
    @Index()
    email: string

    @Column('boolean', { default: false })
    accepted: boolean

    @Column('timestamp', { nullable: true })
    acceptedDate: boolean

    @CreateDateColumn()
    created: string

    @UpdateDateColumn()
    updated: string

}