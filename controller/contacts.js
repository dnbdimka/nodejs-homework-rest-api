const service = require('../service/model/contacts.js')
const {
  schemaAddNewContact,
  schemaUpdatingContact,
} = require('../service/schemasJoi/contacts.js')

const get = async (req, res, next) => {
  try {
    const results = await service.getAllContacts()
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts: results,
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
    console.error(e)
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

  try {
    const result = await service.createContact({
      name,
      email,
      phone,
      favorite,
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
