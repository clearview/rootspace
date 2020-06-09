import PromiseRouter from 'express-promise-router'

const router = PromiseRouter()

router.get('/', async (req, res) => {
  res.send({
      App: 'Root',
      Version: 1.0
  })
})

export { router as defaultRouter }
