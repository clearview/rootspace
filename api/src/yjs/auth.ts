import * as dotenv from 'dotenv'
dotenv.config()
import { config } from 'node-config-ts'

import jwt from 'jsonwebtoken'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { UserService } from '../services'
import { User } from '../database/entities/User'

export const authenticate = async (token: string): Promise<User | null> => {
  try {
    const decoded: any = jwt.verify(token, config.jwt.accessToken.secretKey)
    const userId = decoded.id

    if (typeof userId !== 'number') {
      return null
    }

    const user = await UserService.getInstance().getUserById(userId)

    return user ?? null
  } catch (err) {
    return null
  }
}

export const authorize = async (userId: number, docId: number): Promise<boolean> => {
  const doc = await ServiceFactory.getInstance()
    .getDocService()
    .getById(docId)

  if (!doc) {
    return false
  }

  const inSpace = await ServiceFactory.getInstance()
    .getUserSpaceService()
    .isUserInSpace(userId, doc.spaceId)

  if (inSpace) {
    return true
  }

  return false
}
