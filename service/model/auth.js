const User = require("../schemas/user.js");
const gravatar = require("gravatar");

const findUser = async (email) => User.findOne({ email });

const createUser = async (username, email, password) => {
  const url = gravatar.url(email);

  const newUser = new User({ username, email, avatarURL: url });
  newUser.setPassword(password);
  await newUser.save();
  return newUser;
};

const updateToken = async (id, token) => {
  await User.updateOne(
    { _id: id },
    {
      $set: { token },
    }
  );
};

module.exports = {
  findUser,
  createUser,
  updateToken,
};
