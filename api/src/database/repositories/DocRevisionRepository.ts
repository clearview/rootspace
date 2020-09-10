import { EntityRepository } from 'typeorm'
import { BaseRepository } from './BaseRepository'
import { DocRevision } from '../entities/DocRevision'

@EntityRepository(DocRevision)
export class DocRevisionRepository extends BaseRepository<DocRevision> {}
