const passport = require('passport')
const User = require('../schemas/user')

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    const currentUser = await User.findById(user._id)
    const [, token] = req.headers.authorization?.split(' ')
    const isValidToken = token === currentUser?.token
    if (!user || !currentUser || !isValidToken || err) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        data: 'Unauthorized',
      })
    }
    req.user = user
    next()
  })(req, res, next)
}
module.exports = { auth }
