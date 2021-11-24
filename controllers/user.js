const service = require("../service/model/user.js");
const { schemaUpdateSubscription } = require("../service/schemasJoi/users");
const path = require("path");
const fs = require("fs").promises;
const resizeImageByJimp = require("../service/jimp/resizeImg.js");

const getUser = async (req, res, next) => {
  const { email, subscription } = req.user;
  try {
    res.json({
      status: "success",
      code: 200,
      user: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  const validationResult = schemaUpdateSubscription.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validationResult.error.details[0].message,
    });
  }

  const { id, email } = req.user;
  const { subscription } = req.body;
  try {
    await service.updateSubscription(id, subscription);
    res.json({
      status: "success",
      code: 200,
      user: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const { path: temporaryName, originalname } = req.file;

  const fileName = path.join("public/avatars", id + "_" + originalname);

  try {
    await resizeImageByJimp(temporaryName);
    await service.updateAvatar(id, fileName);
    await fs.rename(temporaryName, fileName);
    res.json({
      status: "success",
      code: 200,
      avatarURL: fileName,
    });
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }
};

module.exports = { getUser, updateSubscription, updateAvatar };
