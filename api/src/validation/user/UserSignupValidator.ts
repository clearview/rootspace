import { validations, validate, extend } from 'indicative/validator'
import { getValue, skippable } from 'indicative-utils'
import { ParsedRule } from 'indicative-parser'
import { UserService } from '../../services/UserService'

declare module 'indicative-rules' {
  interface ValidationRulesContract {
    unique([table, field]: [string, string]): ParsedRule
  }
}

export class UserSignupValidator {
  validate(input: any) {
    extend('unique', {
      async: true,

      compile(args) {
        return args
      },

      async validate(data, field, args, config) {
        const fieldValue = getValue(data, field)

        /*if (skippable(fieldValue, field, config)) {
          return true
        }*/

        const userService = new UserService()
        const user = await userService.getUserByEmail(fieldValue)

        if (user) {
          return false
        }

        return true
      }
    })

    const rules = {
      name: 'required',
      email: [
        validations.required(),
        validations.email(),
        validations.unique(['user', 'email'])
      ],
      password: 'required|min:6',
      password_confirmation: 'required|min:6'
    }

    return validate(input, rules)
  }
}
