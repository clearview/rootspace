import { config } from 'node-config-ts'
import passport from 'passport'
import passportGoogleOauth from 'passport-google-oauth'
import passportLocal from 'passport-local'
import bcrypt from 'bcryptjs'
import { UserService } from './services/UserService'
import { ClientErrName, ClientStatusCode } from './errors/httpErrorProperty'
import { clientError } from './errors/httpError'

import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from './repositories/UserRepository'
import { isNumber } from 'util'

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy
const LocalStrategy = passportLocal.Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.domain + config.google.callbackPath,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const userRepository = getCustomRepository(UserRepository)

      const existingUser = await userRepository.findOne({
        email: profile.emails[0].value,
      })
      if (!existingUser) {
        const user = await userRepository.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: '666',
          authProvider: 'google',
          active: true,
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
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const userService = new UserService()
        const user = await userService.getUserByEmail(email, true)

        if (!user) {
          return done(
            clientError('User not found', ClientErrName.EntityNotFound)
          )
        }

        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return done(err)
          }

          if (res !== true) {
            return done(
              clientError('Wrong Password', ClientErrName.WrongPassword),
              user
            )
          }

          if (user.emailConfirmed !== true) {
            return done(
              clientError(
                'Email not confirmed',
                ClientErrName.UserNotConfirmed,
                ClientStatusCode.Forbidden
              )
            )
          }

          return done(null, user)
        })
      } catch (err) {
        return done(err)
      }
    }
  )
)

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecretKey,
}

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    const userId = payload.id

    if (!isNumber(userId)) {
      return done(null, false, { message: 'Invalid payload' })
    }

    const user = await getCustomRepository(UserRepository).findOne(userId)
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
