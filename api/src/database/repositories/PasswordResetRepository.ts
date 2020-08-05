import { EntityRepository, Repository } from 'typeorm'
import { PasswordReset } from '../entities/PasswordReset'

@EntityRepository(PasswordReset)
export class PasswordResetRepository extends Repository<PasswordReset> {}
