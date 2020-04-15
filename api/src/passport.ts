import { config } from 'node-config-ts'
import passport from 'passport'
import passportGoogleOauth from 'passport-google-oauth'
import passportLocal from 'passport-local'
import { hashPassword } from './utils'
import { UserService } from './services/UserService'
import { HttpError } from './errors/HttpError'

import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions
} from 'passport-jwt'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from './repositories/UserRepository'

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy
const LocalStrategy = passportLocal.Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const userRepository = getCustomRepository(UserRepository)

      const existingUser = await userRepository.findOne({
        email: profile.emails[0].value
      })
      if (!existingUser) {
        const user = await userRepository.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: '666',
          authProvider: 'google',
          active: true
        })
        const newUser = await userRepository.save(user)
        return done(null, newUser.id)
      }

      return done(null, existingUser.id)
    }
  )
)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const userService = new UserService()
        const user = await userService.getUserByEmail(email)

        if (!user) {
          return done(new HttpError(401, 'User not found'), false)
        }

        const hash = await hashPassword(password)

        if (hash !== user.password) {
          //return done(new HttpError(401, 'Wrong Password'), false)
        }

        if (user.confirmed === false) {
          return done(new HttpError(401, 'User not confirmed'), false)
        }
        return done(null, user)
      } catch (error) {
        return done(new HttpError(500, error.message))
      }
    }
  )
)

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecretKey
}

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    const user = await getCustomRepository(UserRepository).findOne(payload.id)
    if (user) {
      return done(null, user)
    }
    return done(null, false, { message: 'Wrong token' })
  })
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

export default passport
