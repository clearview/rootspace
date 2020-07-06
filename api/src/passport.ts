import { config } from 'node-config-ts'
import passport from 'passport'
import * as Sentry from '@sentry/node'
import passportGoogleOauth from 'passport-google-oauth'
import passportLocal from 'passport-local'
import bcrypt from 'bcryptjs'
import { UserService } from './services'
import { unauthorized } from './errors'
import {
    Strategy as JwtStrategy,
    ExtractJwt,
    StrategyOptions, VerifiedCallback,
} from 'passport-jwt'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from './repositories/UserRepository'

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy
const LocalStrategy = passportLocal.Strategy
const googleCallbackURL = config.domain + config.google.callbackPath

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: googleCallbackURL
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const userRepository = getCustomRepository(UserRepository)

      const existingUser = await userRepository.findOne({
        email: profile.emails[0].value,
      })
      if (!existingUser) {
        const user = await userRepository.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          emailConfirmed: true,
          password: '',
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
      passwordField: 'password'
    },
    async (email: string, password: string, done) => {
      try {
        const userService = UserService.getInstance()
        const user = await userService.getUserByEmail(email, true)

        if (!user) {
          return done(unauthorized())
        }

        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return done(err)
          }

          if (res !== true) {
            return done(unauthorized())
          }

          /* if (user.emailConfirmed !== true) {
            return done(
              unauthorized()
            )
          } */

          if (user.active !== true) {
            return done(unauthorized())
          }

          if (config.env === 'production') {
            Sentry.configureScope((scope) => {
                scope.setUser({id: user.id.toString(), email: user.email})
            })
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
    passReqToCallback: true
}

passport.use(
  new JwtStrategy(jwtOptions, async (req: any, payload: any, done: VerifiedCallback) => {
    const userId = payload.id

    if (typeof userId !== 'number') {
      return done(null, false, { message: 'Invalid payload' })
    }

    const user = await getCustomRepository(UserRepository).findOne(userId)
    if (user) {
        req.user = user
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
