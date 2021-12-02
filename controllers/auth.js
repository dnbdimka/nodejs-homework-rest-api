const service = require('../service/model/auth.js')
const jwt = require('jsonwebtoken')
const {
  schemaSignUp,
  schemaSignIn,
  schemaVerifyRetry,
} = require('../service/schemasJoi/users')
const { sendEmail } = require('../service/email/email')
const { v4: uuidv4 } = require('uuid')

require('dotenv').config()

const secret = process.env.SECRET

const register = async (req, res, next) => {
  const { username, email, password } = req.body
  const validationResult = schemaSignUp.validate(req.body)

  if (validationResult.error) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: validationResult.error.details[0].message,
    })
    return
  }

  const user = await service.findUser(email)
  if (user) {
    return res.status(409).json({
      status: 'fail',
      code: 409,
      message: 'Email in use',
    })
  }

  const verifyToken = uuidv4()

  try {
    await sendEmail(verifyToken, email, username)
    const newUser = await service.createUser(
      username,
      email,
      password,
      verifyToken
    )
    res.status(201).json({
      status: 'success',
      code: 201,
      user: { email, subscription: newUser.subscription },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  const validationResult = schemaSignIn.validate(req.body)

  if (validationResult.error) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: validationResult.error.details[0].message,
    })
  }

  const user = await service.findUser(email)

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: 'fail',
      code: 401,
      message: 'Email or password is wrong',
    })
  }

  if (!user.verify) {
    return res.status(401).json({
      status: 'fail',
      code: 401,
      message: "You haven't verified your mail yet",
    })
  }

  const payload = {
    id: user.id,
    username: user.username,
  }

  const token = jwt.sign(payload, secret, { expiresIn: '3h' })
  await service.updateToken(user.id, token)
  res.json({
    status: 'success',
    code: 200,
    data: {
      token,
      user: { email, subscription: user.subscription },
    },
  })
}

const logout = async (req, res, next) => {
  const id = req.user.id
  try {
    await service.updateToken(id, null)
    return res.status(200).json({
      status: 'success',
      code: 200,
    })
  } catch (error) {
    next(error)
  }
}

const verify = async (req, res, next) => {
  try {
    const { verifyToken } = req.params
    const result = await service.verify(verifyToken)
    if (result) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Verification successful',
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'User not found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const verifyRetry = async (req, res, next) => {
  const validationResult = schemaVerifyRetry.validate(req.body)

  if (validationResult.error) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: validationResult.error.details[0].message,
    })
  }
  const { email } = req.body

  try {
    // const { verifyToken } = req.params;
    const user = await service.findUser(email)
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'User not found',
      })
    }
    if (user.verify) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Verification has already been passed',
      })
    }

    await sendEmail(user.verifyToken, email, user.username)

    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Verification email sent',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  verify,
  verifyRetry,
  login,
  logout,
}
