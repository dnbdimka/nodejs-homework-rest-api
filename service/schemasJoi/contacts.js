const Joi = require('joi')

const schemaAddNewContact = Joi.object({
  name: Joi.string()
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
  phone: Joi.string()
    .pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)
    .min(9)
    .max(13)
    .required(),
  favorite: Joi.boolean(),
})
const schemaUpdatingContact = Joi.object({
  name: Joi.string()
    .pattern(/^[a-z '-]+$/i)
    .min(3)
    .max(30),
  email: Joi.string()
    .pattern(
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
    )
    .email(),
  phone: Joi.string()
    .pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)
    .min(9)
    .max(13),
  favorite: Joi.boolean(),
})

module.exports = { schemaAddNewContact, schemaUpdatingContact }
