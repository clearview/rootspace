require('dotenv').config()
import { config } from 'node-config-ts'
import passport from 'passport'
import passportGoogleOauth from 'passport-google-oauth'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from './repositories/UserRepository'

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy

passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    const userRepository = getCustomRepository(UserRepository)
    
    const existingUser = await userRepository.findOne({ email: profile.emails[0].value })
    if (!existingUser) {
      const user = await userRepository.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: '666',
        auth_provider: 'google',
        active: true
      })
      const newUser = await userRepository.save(user)
      return done(null, newUser.id)
    }
    
    return done(null, existingUser.id)
  }
))

let jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecretKey
}

passport.use(new JwtStrategy(jwtOptions, async function(payload, done) {
  const user = await getCustomRepository(UserRepository).findOne(payload.id)
  if (user) {
    return done(null, user)
  }
  return done(null, false, { message: 'Wrong token' }); 
}))

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

export default passport