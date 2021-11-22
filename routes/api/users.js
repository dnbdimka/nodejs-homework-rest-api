const express = require('express')
const router = express.Router()
const ctrlAuth = require('../../controllers/auth.js')
const { auth } = require('../../service/middlewares/auth.js')
// const auth = require("./../../middlewares/checkToken.js");

router.post('/signup', ctrlAuth.register)
router.post('/signin', ctrlAuth.login)
router.post('/logout', auth, ctrlAuth.logout)
router.get('/current', auth, ctrlAuth.getUser)
router.patch('/', auth, ctrlAuth.updateSubscription)

module.exports = router
