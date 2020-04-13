import passport from '../passport'

export default passport.authenticate('jwt', { session: false })