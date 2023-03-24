import arena from '../arena'
import arenaAuth from '../middleware/arenaAuth'
import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.use('/arena', arenaAuth, arena)

export { router as arenaRouter }
