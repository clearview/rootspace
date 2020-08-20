import httpRequestContext from 'http-request-context'
import { config } from 'node-config-ts'
import passport from 'passport'
import * as Sentry from '@sentry/node'
import passportGoogleOauth from 'passport-google-oauth'
import passportLocal from 'passport-local'
import bcrypt from 'bcryptjs'
import { ActivityService, SpaceService, UserService } from './services'
import { unauthorized } from './errors'
import {
    Strategy as JwtStrategy,
    ExtractJwt,
    StrategyOptions, VerifiedCallback,
} from 'passport-jwt'
import { Ability, AbilityBuilder } from '@casl/ability'
import { Actions, Subjects } from './middleware/AuthMiddleware'
import { UserActivities } from './database/entities/activities/UserActivities'
import { ActivityEvent } from './services/events/ActivityEvent'
import { ServiceFactory } from './services/factory/ServiceFactory'
import { UserAuthProvider } from './values/user/UserAuthProvider'

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

      const activityService = ServiceFactory.getInstance().getActivityService()
      const existingUser = await ServiceFactory.getInstance().getUserService().getUserByEmail(profile.emails[0].value)

      if (!existingUser) {
        const newUser = await ServiceFactory.getInstance().getUserService().signup({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          emailConfirmed: true,
          authProvider: UserAuthProvider.GOOGLE,
          active: true,
        }, false)

        return done(null, newUser.id)
      }

      await activityService.add(ActivityEvent
        .withAction(UserActivities.Login)
        .fromActor(existingUser.id)
        .forEntity(existingUser)
      )
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
        const userService = ServiceFactory.getInstance().getUserService()
        const user = await userService.getUserByEmail(email, true)

        const activityService = ServiceFactory.getInstance().getActivityService()

        if (!user) {
          return done(unauthorized())
        }

        bcrypt.compare(password, user.password, async (err, res) => {
          if (err) {
            return done(err)
          }

          if (res !== true) {
            await activityService.add(ActivityEvent
              .withAction(UserActivities.Login_Failed)
              .fromActor(user.id)
              .forEntity(user)
            )
            return done(unauthorized())
          }

          /* if (user.emailConfirmed !== true) {
            return done(
              unauthorized()
            )
          } */

          if (user.active !== true) {
            await activityService.add(ActivityEvent
              .withAction(UserActivities.Login_Failed)
              .fromActor(user.id)
              .forEntity(user)
            )
            return done(unauthorized())
          }

          httpRequestContext.set('user', user)

          await activityService.add(ActivityEvent
            .withAction(UserActivities.Login)
            .fromActor(user.id)
            .forEntity(user)
          )
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
    const tokenExpiryTimestamp = Number(payload.exp)

    if (typeof userId !== 'number' || !tokenExpiryTimestamp || tokenExpiryTimestamp === 0) {
      return done(null, false, { message: 'Invalid payload' })
    }

    const expirationDate = new Date(tokenExpiryTimestamp * 1000)

    if(expirationDate < new Date()) {
      return done(null, false, { message: 'Token expired' })
    }

    const user = await UserService.getInstance().getUserById(userId)

    if (user) {
      req.user = user

      if (config.env === 'production') {
        Sentry.configureScope((scope) => {
          scope.setUser({id: user.id.toString(), email: user.email})
        })
      }

      const { can, cannot, rules } = new AbilityBuilder()
      const userSpaces = await SpaceService.getInstance().getSpacesByUserId(req.user.id)
      req.user.userSpaceIds = userSpaces.map(space => { return space.id })

      // User can manage any subject they own
      can(Actions.Manage, Subjects.All, { userId: user.id })

      // User can manage any subject from the space they have access to
      can(Actions.Manage, Subjects.All, { spaceId: { $in: req.user.userSpaceIds } })

      // User can not manage subjects outside spaces they belong to
      cannot(Actions.Manage, Subjects.All, { spaceId: { $nin: req.user.userSpaceIds } })
        .because('Access to space not allowed')

      // @ts-ignore
      req.user.ability = new Ability<[Actions, Subjects]>(rules)

      httpRequestContext.set('user', user)
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
