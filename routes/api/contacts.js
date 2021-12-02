const express = require('express')
const router = express.Router()
const ctrlContact = require('../../controllers/contacts.js')
const auth = require('../../service/middlewares/auth.js')

router.get('/', auth, ctrlContact.get)

router.get('/:contactId', auth, ctrlContact.getById)

router.post('/', auth, ctrlContact.create)

router.put('/:contactId', auth, ctrlContact.update)

router.patch('/:contactId/favorite', auth, ctrlContact.updateStatus)

router.delete('/:contactId', auth, ctrlContact.remove)

module.exports = router
