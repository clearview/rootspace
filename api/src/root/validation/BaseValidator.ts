import { getConnection } from 'typeorm'
import { validateAll, extend } from 'indicative/validator'
import { getValue } from 'indicative-utils'
import { Schema, ParsedRule } from 'indicative-parser'
import { validationFailed } from '../../response/errors'
import { configure } from 'indicative/validator'
import { pwnedPassword } from 'hibp'
import { validate as uuidValidate } from 'uuid'

declare module 'indicative-rules' {
  interface ValidationRulesContract {
    dbUnique([entity, alias, field, skipIdValue]: [string, string, string, number?]): ParsedRule
    compromisedPassword(): ParsedRule
  }
}

configure({
  existyStrict: true,
})

export abstract class BaseValidator {
  constructor() {
    this.extend()
  }

  protected extend() {
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
          return !res
        } catch (e) {
          throw new Error('Server error')
        }
      },
    })

    extend('compromisedPassword', {
      async: true,

      compile(args) {
        return args
      },

      async validate(data, field, args, config) {
        const fieldValue = getValue(data, field)

        try {
          const numberOfPwns = await pwnedPassword(fieldValue)
          return !numberOfPwns
        } catch (e) {
          /**
           * Skip check in case HIBP API is unreachable, do not
           * throw new Error('HIBP API error')
           */
          return true
        }
      },
    })

    extend('uuid', {
      async: true,

      compile(args) {
        return args
      },

      async validate(data, field, args, config) {
        const fieldValue = getValue(data, field)
        return uuidValidate(fieldValue)
      },
    })
  }

  abstract rules(): Schema

  async validate(input: any) {
    try {
      return await validateAll(input, this.rules(), {}, { existyStrict: true })
    } catch (errors) {
      throw validationFailed('Validation failed', errors)
    }
  }
}
