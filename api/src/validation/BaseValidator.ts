import { getConnection } from 'typeorm'
import { validateAll, extend } from 'indicative/validator'
import { getValue, skippable } from 'indicative-utils'
import { Schema, ParsedRule } from 'indicative-parser'
import { validationFailed } from '../errors/httpError'

declare module 'indicative-rules' {
  interface ValidationRulesContract {
    dbUnique([entity, alias, field, skipIdValue]: [
      string,
      string,
      string,
      number?
    ]): ParsedRule
  }
}

export abstract class BaseValidator {
  constructor() {
    this.dbUnique()
  }

  protected dbUnique() {
    extend('dbUnique', {
      async: true,

      compile(args) {
        return args
      },

      async validate(data, field, args, config) {
        const fieldValue = getValue(data, field)
        const [entity, alias, column, skipIdValue] = args

        try {
          const queryBuilder = getConnection()
            .getRepository(entity)
            .createQueryBuilder(alias)
            .where(`${alias}.${column} = :emailValue`, {
              emailValue: fieldValue,
            })

          if (skipIdValue) {
            queryBuilder.andWhere(`${alias}.id != :idValue`, {
              idValue: skipIdValue,
            })
          }

          const res = await queryBuilder.getOne()

          if (res) {
            return false
          }

          return true
        } catch (e) {
          throw new Error('Server error')
        }
      },
    })
  }

  abstract rules(): Schema

  async validate(input: any) {
    try {
      return await validateAll(input, this.rules())
    } catch (errors) {
      throw validationFailed('Validation failed', errors)
    }
  }
}
