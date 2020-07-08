import { defaultRouter } from './defaultRouter'
import { userRouter } from './userRouter'
import { docRouter } from './docRouter'
import { spaceRouter } from './spaceRouter'
import { nodeRouter } from './nodeRouter'
import { linkRouter } from './linkRouter'
import taskBoardRouters from './tasks'
import { inviteRouter } from './inviteRouter'
import { uploadRouter } from './uploadRouter'

const routers = [
  defaultRouter,
  userRouter,
  docRouter,
  spaceRouter,
  nodeRouter,
  linkRouter,
  ...taskBoardRouters,
  inviteRouter,
  uploadRouter,
]

export default routers
