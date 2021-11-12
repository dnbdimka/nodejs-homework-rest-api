const express = require('express')
const router = express.Router()
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../model/index.js')
const Joi = require('joi')

const schemaAddNewContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(9).max(13).required(),
})
const schemaUpdatingContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(9).max(13),
}).or('name', 'email', 'phone')

router.get('/', async (req, res, next) => {
  res.json(await listContacts())
})

router.get('/:contactId', async (req, res, next) => {
  const currentContact = await getContactById(req.params.contactId)
  if (!currentContact) {
    res.status(404)
    res.json({ message: 'Not found' })
    return
  }
  res.json(await getContactById(req.params.contactId))
})

router.post('/', async (req, res, next) => {
  const newContact = await addContact(schemaAddNewContact.validate(req.body))

  if (newContact.error) {
    res.json({ error: newContact.error })
    return
  }
  res.json(newContact)
})

router.delete('/:contactId', async (req, res, next) => {
  const isRemove = await removeContact(req.params.contactId)
  if (!isRemove) {
    res.status(404)
    res.json({ message: 'Not found' })
    return
  }
  res.json({ message: 'contact deleted' })
})

router.patch('/:contactId', async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.json({ message: 'missing fields' })
  }

  const currentContact = await updateContact(
    req.params.contactId,
    schemaUpdatingContact.validate(req.body)
  )

  if (currentContact.error) {
    res.json({ error: currentContact.error })
    return
  }

  if (!currentContact) {
    res.status(404)
    res.json({ message: 'Not found' })
    return
  }
  res.json(currentContact)
})

module.exports = router
