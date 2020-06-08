import {defaultRouter} from './defaultRouter'
import {userRouter} from './userRouter'
import {docRouter} from './docRouter'
import {spaceRouter} from './spaceRouter'
import {linkRouter} from './linkRouter'
import {inviteRouter} from './inviteRouter'
import {uploadRouter} from './uploadRouter'

const routers = [
    defaultRouter,
    userRouter,
    docRouter,
    spaceRouter,
    linkRouter,
    inviteRouter,
    uploadRouter
]

export default routers

