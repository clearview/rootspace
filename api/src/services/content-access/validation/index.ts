import { ContentAccessUpdateValidator } from './ContentAccessUpdateValidator'

export function validateContentAccessUpdate(input: object): Promise<any> {
  return new ContentAccessUpdateValidator().validate(input)
}
