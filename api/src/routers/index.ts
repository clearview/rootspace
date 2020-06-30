import { defaultRouter } from './defaultRouter'
import { userRouter } from './userRouter'
import { docRouter } from './docRouter'
import { spaceRouter } from './spaceRouter'
import { linkRouter } from './linkRouter'
import { taskRouter } from './taskRouter'
import { inviteRouter } from './inviteRouter'
import { uploadRouter } from './uploadRouter'

const routers = [
    defaultRouter,
    userRouter,
    docRouter,
    spaceRouter,
    linkRouter,
    taskRouter,
    inviteRouter,
    uploadRouter
]

export default routers
