const User = require('../schemas/user.js')
const gravatar = require('gravatar')

const findUser = async (email) => await User.findOne({ email })

const createUser = async (username, email, password, verifyToken) => {
  const url = gravatar.url(email)

  const newUser = new User({ username, email, avatarURL: url, verifyToken })
  newUser.setPassword(password)
  await newUser.save()
  return newUser
}

const updateToken = async (id, token) => {
  await User.updateOne(
    { _id: id },
    {
      $set: { token },
    }
  )
}

const verify = async (verifyToken) => {
  const user = await User.findOne({ verifyToken })
  if (user) {
    await User.updateOne({ verifyToken }, { verify: true, verifyToken: null })
    return true
  }

  return false
}

module.exports = {
  findUser,
  createUser,
  updateToken,
  verify,
}
