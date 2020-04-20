import { getConnection } from 'typeorm'
import { validateAll, extend } from 'indicative/validator'
import { getValue, skippable } from 'indicative-utils'
import { Schema, ParsedRule } from 'indicative-parser'

declare module 'indicative-rules' {
  interface ValidationRulesContract {
    unique([entity, alias, field]: [any, string, string]): ParsedRule
  }
}

export abstract class BaseValidator {
  constructor() {
    this.unique()
  }

  protected unique() {
    extend('unique', {
      async: true,

      compile(args) {
        return args
      },

      async validate(data, field, args, config) {
        const fieldValue = getValue(data, field)

        const [entity, alias, column] = args

        try {
          const res = await getConnection()
            .getRepository(entity)
            .createQueryBuilder(alias)
            .where(`${alias}.${column}=:value`, { value: fieldValue })
            .getOne()

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

  validate(input: any) {
    return validateAll(input, this.rules())
  }
}
