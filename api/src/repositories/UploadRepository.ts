import { EntityRepository, Repository } from 'typeorm'
import { Upload } from '../database/entities/Upload'

@EntityRepository(Upload)
export class UploadRepository extends Repository<Upload> {}