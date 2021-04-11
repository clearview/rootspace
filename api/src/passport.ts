import httpRequestContext from 'http-request-context'
import { config } from 'node-config-ts'
import passport from 'passport'
import * as Sentry from '@sentry/node'
import passportGoogleOauth from 'passport-google-oauth'
import passportLocal from 'passport-local'
import bcrypt from 'bcryptjs'
import { Request } from 'express'
import { UserService, UserSpaceService } from './services'
import { unauthorized } from './response/errors'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt'
import { Ability, AbilityBuilder } from '@casl/ability'
import { Actions, Subjects } from './middleware/AuthMiddleware'
import { ServiceFactory } from './services/factory/ServiceFactory'
import { UserAuthProvider } from './types/user'
import { UserActivitiy } from './services/activity/activities/user'

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy
const LocalStrategy = passportLocal.Strategy
const googleCallbackURL = config.domain + config.google.callbackPath

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: googleCallbackURL,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const activityService = ServiceFactory.getInstance().getActivityService()

      const user = await ServiceFactory.getInstance()
        .getUserService()
        .getUserByEmail(profile.emails[0].value)

      if (!user) {
        const newUser = await ServiceFactory.getInstance()
          .getUserService()
          .signup(
            {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              emailConfirmed: true,
              authProvider: UserAuthProvider.GOOGLE,
              active: true,
            },
            false
          )

        return done(null, newUser.id)
      }

      await activityService.activityNotification(UserActivitiy.login(user))

      return done(null, user.id)
    }
  )
)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      try {
        const userService = ServiceFactory.getInstance().getUserService()
        const activityService = ServiceFactory.getInstance().getActivityService()

        const user = await userService.getUserByEmail(email, { addSelect: ['password', 'active'] })

        if (!user) {
          return done(unauthorized())
        }

        bcrypt.compare(password, user.password, async (err, res) => {
          if (err) {
            return done(err)
          }

          if (res !== true) {
            return done(unauthorized())
          }

          if (user.active !== true) {
            return done(unauthorized())
          }

          await activityService.activityNotification(UserActivitiy.login(user))

          return done(null, user)
        })
      } catch (err) {
        return done(err)
      }
    }
  )
)

const jwtRefreshOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.refreshToken.secretKey,
  passReqToCallback: true,
}

passport.use(
  'refreshToken',
  new JwtStrategy(jwtRefreshOptions, async (req: any, payload: any, done: VerifiedCallback) => {
    const userId = payload.id
    verifyJWTPayload(payload, done)

    const user = await UserService.getInstance().getUserById(userId)
    if (user) {
      return done(null, user)
    }

    return done(null, false, { message: 'Wrong token' })
  })
)

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.accessToken.secretKey,
  passReqToCallback: true,
}

passport.use(
  new JwtStrategy(jwtOptions, async (req: Request, payload: any, done: VerifiedCallback) => {
    const userId = payload.id
    verifyJWTPayload(payload, done)

    const user = await UserService.getInstance().getUserById(userId)

    if (!user) {
      return done(null, false, { message: 'Wrong token' })
    }

    if (config.env === 'production') {
      Sentry.configureScope((scope) => {
        scope.setUser({ id: user.id.toString(), email: user.email })
      })
    }

    const spaces = new Map<number, number>()

    for (const userSpace of await UserSpaceService.getInstance().getByUserId(user.id, {active: true})) {
      spaces.set(userSpace.spaceId, userSpace.role)
    }

    const { can, cannot, rules } = new AbilityBuilder()

    // User can manage any subject they own
    can(Actions.Manage, Subjects.All, { userId: user.id })

    // User can manage any subject from the space they have access to
    can(Actions.Manage, Subjects.All, { spaceId: { $in: Array.from(spaces.keys()) } })

    // User can not manage subjects outside spaces they belong to
    cannot(Actions.Manage, Subjects.All, { spaceId: { $nin: Array.from(spaces.keys()) } }).because(
      'Access to space is not allowed'
    )

    // @ts-ignore
    const ability = new Ability<[Actions, Subjects]>(rules)

    const requestUser = { ...user, spaces, ability }

    httpRequestContext.set('user', user)

    return done(null, requestUser)
  })
)

function verifyJWTPayload(payload: any, done: VerifiedCallback) {
  const userId = payload.id
  const tokenExpiryTimestamp = Number(payload.exp)

  if (typeof userId !== 'number' || !tokenExpiryTimestamp || tokenExpiryTimestamp === 0) {
    return done(null, false, { message: 'Invalid payload' })
  }

  const expirationDate = new Date(tokenExpiryTimestamp * 1000)

  if (expirationDate < new Date()) {
    return done(null, false, { message: 'Token expired' })
  }
}

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

export default passport
