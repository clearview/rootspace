import { Ability } from '@casl/ability'

declare global {
  namespace Express {
    interface User {
      id: number
      firstName: string
      lastName: string
      email: string
      ability: Ability
      spaces: Map<number, number>
    }
  }
}
