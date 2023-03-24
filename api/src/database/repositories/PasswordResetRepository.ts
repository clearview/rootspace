import { EntityRepository, Repository } from 'typeorm'
import { PasswordReset } from '../entities/PasswordReset'

@EntityRepository(PasswordReset)
export class PasswordResetRepository extends Repository<PasswordReset> {
  getByToken(token: string): Promise<PasswordReset | undefined> {
    return this.createQueryBuilder('passwordReset')
      .where('passwordReset.token = :token', {
        token,
      })
      .getOne()
  }
}
