import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, AfterLoad } from 'typeorm'
import { IUploadVersions } from '../../types/upload'

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('integer', { nullable: true })
  entityId: number

  @Column('varchar', { nullable: true })
  entity: string

  @Column('varchar', { nullable: true })
  type: string

  @Column('varchar', { nullable: true })
  key: string

  @Column('varchar', { nullable: true })
  bucket: string

  @Column('varchar', { nullable: true })
  filename: string

  @Column('json', { nullable: true })
  versions: IUploadVersions

  @Column('varchar')
  mimetype: string

  @Column('integer')
  size: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
