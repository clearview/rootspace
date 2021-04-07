import { defaultRouter } from './defaultRouter'
import { arenaRouter } from './arenaRouter'
import { userRouter } from './userRouter'
import { docRouter } from './docRouter'
import { spaceRouter } from './spaceRouter'
import { nodeRouter } from './nodeRouter'
import { linkRouter } from './linkRouter'
import taskBoardRouters from './tasks'
import { inviteRouter } from './inviteRouter'
import { uploadRouter } from './uploadRouter'
import { folderRouter } from './folderRouter'
import { embedRouter } from './embedRouter'
import { notificationRouter } from './notificationRouter'
import { activityRouter } from './activityRouter'
import { contentAccessRouter } from './contentAccessRouter'
import { storageRouter } from './storageRouter'

const routers = [
  defaultRouter,
  arenaRouter,
  userRouter,
  docRouter,
  spaceRouter,
  nodeRouter,
  linkRouter,
  ...taskBoardRouters,
  inviteRouter,
  uploadRouter,
  folderRouter,
  embedRouter,
  folderRouter,
  notificationRouter,
  activityRouter,
  contentAccessRouter,
  storageRouter
]

export default routers
