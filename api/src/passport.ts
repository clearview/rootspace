import { config } from 'node-config-ts'
import passport from 'passport'
import passportGoogleOauth from 'passport-google-oauth'
import passportLocal from 'passport-local'
import bcrypt from 'bcryptjs'
import { UserService } from './services/UserService'
import { HttpClientError } from './errors/HttpClientError'
import { clientError } from './errors/httpErrors'

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
      callbackURL: config.appDomain + config.google.callbackPath,
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
            new HttpClientError('User not found', clientError.entityNotFound)
          )
        }

        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return done(err)
          }

          if (res !== true) {
            return done(
              new HttpClientError('Wrong Password', clientError.wrongPassword),
              user
            )
          }

          if (user.emailConfirmed !== true) {
            return done(
              new HttpClientError(
                'Email not confirmed',
                clientError.userNotConfirmed
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
