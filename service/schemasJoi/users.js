const Joi = require('joi')

const schemaSignUp = Joi.object({
  username: Joi.string()
    .pattern(/^[a-z '-]+$/i)
    .min(2)
    .max(30)
    .required(),
  email: Joi.string()
    .pattern(
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
    )
    .email()
    .required(),
  password: Joi.string().required(),
})

const schemaSignIn = Joi.object({
  email: Joi.string()
    .pattern(
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
    )
    .email()
    .required(),
  password: Joi.string().required(),
})

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.any().valid('starter', 'pro', 'business').required(),
})

const schemaVerifyRetry = Joi.object({
  email: Joi.string()
    .pattern(
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
    )
    .email()
    .required(),
})

module.exports = {
  schemaSignUp,
  schemaSignIn,
  schemaUpdateSubscription,
  schemaVerifyRetry,
}
