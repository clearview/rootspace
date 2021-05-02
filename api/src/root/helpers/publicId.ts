import { customAlphabet } from 'nanoid'

export const publicId = () => {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 21)
  return nanoid()
}
