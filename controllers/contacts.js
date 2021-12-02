const jwt = require('jsonwebtoken')
const service = require('../service/model/contacts.js')
const {
  schemaAddNewContact,
  schemaUpdatingContact,
} = require('../service/schemasJoi/contacts.js')

const get = async (req, res, next) => {
  const { page = 1, limit = 5, favorite } = req.query
  if (
    (isNaN(+page) && page !== undefined) ||
    (isNaN(+limit) && limit !== undefined)
  ) {
    return res.status(400).json({
      status: 400,
      message: 'Bad request',
    })
  }
  const [, token] = req.headers.authorization.split(' ')
  const ownerId = jwt.decode(token).id
  try {
    const result = await service.getAllContacts(
      +page,
      +limit,
      favorite,
      ownerId
    )

    const totalContacts = await service.getTotalContacts(favorite, ownerId)
    const totalPages = Math.ceil(totalContacts / +limit)

    if (+page > totalPages) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Page not found',
      })
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts: result,
        totalContacts,
        page: +page,
        totalPages,
        perPage: +limit,
        prevPage: +page <= 1 ? null : +page - 1,
        nextPage: +page >= totalPages ? null : +page + 1,
      },
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const getById = async (req, res, next) => {
  const { contactId } = req.params
  try {
    const result = await service.getContactById(contactId)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${contactId}`,
      })
    }
  } catch (e) {
    next(e)
  }
}

const create = async (req, res, next) => {
  const validationResult = schemaAddNewContact.validate(req.body)

  if (validationResult.error) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: validationResult.error.details[0].message,
    })
    return
  }

  const { name, email, phone, favorite } = req.body
  const [, token] = req.headers.authorization.split(' ')
  const ownerId = jwt.decode(token).id

  try {
    const result = await service.createContact({
      name,
      email,
      phone,
      favorite,
      ownerId,
    })

    res.status(201).json({
      status: 'success',
      code: 201,
      data: { contact: result },
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Missing fields',
    })
    return
  }

  const validationResult = schemaUpdatingContact.validate(req.body)

  if (validationResult.error) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: validationResult.error.details[0].message,
    })
    return
  }

  const { contactId } = req.params
  const { name, email, phone } = req.body
  try {
    const result = await service.updateContact(contactId, {
      name,
      email,
      phone,
    })
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${contactId}`,
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const updateStatus = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Missing fields',
    })
    return
  }

  const validationResult = schemaUpdatingContact.validate(req.body)

  if (validationResult.error) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: validationResult.error.details[0].message,
    })
    return
  }

  const { favorite = false } = req.body
  const { contactId } = req.params

  try {
    const result = await service.updateContact(contactId, { favorite })
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${contactId}`,
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const remove = async (req, res, next) => {
  const { contactId } = req.params

  try {
    const result = await service.removeContact(contactId)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        message: `Contact with id: ${contactId}, is deleted`,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

module.exports = { get, getById, create, update, updateStatus, remove }
