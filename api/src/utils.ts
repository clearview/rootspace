import bcrypt from 'bcryptjs'

export function mapRoute(ctrl: any, fn: string) {
  const instances = {}
  if (instances[ctrl] instanceof ctrl === false) {
    instances[ctrl] = new ctrl()
  }
  return instances[ctrl][fn].bind(instances[ctrl])
}

export function hashPassword(password: string) {
  const BCRYPT_WORK_FACTOR_BASE = 12
  const BCRYPT_DATE_BASE = 1483228800000
  const BCRYPT_WORK_INCREASE_INTERVAL = 47300000000

  return new Promise((resolve, reject) => {
    const BCRYPT_CURRENT_DATE = new Date().getTime()
    const BCRYPT_WORK_INCREASE = Math.max(
      0,
      Math.floor(
        (BCRYPT_CURRENT_DATE - BCRYPT_DATE_BASE) / BCRYPT_WORK_INCREASE_INTERVAL
      )
    )
    const BCRYPT_WORK_FACTOR = Math.min(
      19,
      BCRYPT_WORK_FACTOR_BASE + BCRYPT_WORK_INCREASE
    )

    bcrypt.genSalt(BCRYPT_WORK_FACTOR, (saltError, salt) => {
      if (saltError) {
        return reject(saltError)
      }

      bcrypt.hash(password, salt, (hashError, hashedPassword) => {
        if (hashError) {
          return reject(hashError)
        }

        resolve(hashedPassword)
      })
    })
  })
}
