const User = require('../schemas/user.js')

const updateSubscription = async (id, subscription) =>
  User.updateOne(
    { _id: id },
    {
      $set: { subscription },
    }
  )

const updateAvatar = async (id, avatarURL) =>
  User.updateOne(
    { _id: id },
    {
      $set: { avatarURL },
    }
  )

module.exports = { updateSubscription, updateAvatar }
