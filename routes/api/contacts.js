const express = require('express')
const router = express.Router()
const ctrlContact = require('../../controllers/contacts.js')
const auth = require('../../service/middlewares/auth.js')

router.get('/', auth, ctrlContact.get)

router.get('/:contactId', ctrlContact.getById)

router.post('/', auth, ctrlContact.create)

router.put('/:contactId', ctrlContact.update)

router.patch('/:contactId/favorite', ctrlContact.updateStatus)

router.delete('/:contactId', ctrlContact.remove)

module.exports = router
