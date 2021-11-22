const User = require('../schemas/user.js')

const findUser = async (email) => User.findOne({ email })

const createUser = async (username, email, password) => {
  const newUser = new User({ username, email })
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

const updateSubscription = async (id, subscription) =>
  User.updateOne(
    { _id: id },
    {
      $set: { subscription },
    }
  )

module.exports = {
  findUser,
  createUser,
  updateToken,
  updateSubscription,
}
