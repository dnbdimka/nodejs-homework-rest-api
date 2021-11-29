const Contact = require('../schemas/contact.js')

const getTotalContacts = async (favorite, ownerId) => {
  console.log(favorite)
  if (!!favorite === true) {
    console.log('enter')
    return Contact.find({ ownerId, favorite: true }).count()
  }
  console.log('not enter')
  return Contact.find({ ownerId }).count()
}

const getAllContacts = async (page, limit, favorite, ownerId) => {
  if (!!favorite === true) {
    return Contact.find(
      { ownerId, favorite: true },
      { ownerId: 0, createdAt: 0, updatedAt: 0 }
    )
      .limit(limit)
      .skip((page - 1) * limit)
  }
  return Contact.find({ ownerId }, { ownerId: 0, createdAt: 0, updatedAt: 0 })
    .limit(limit)
    .skip((page - 1) * limit)
}

const getContactById = (id) => {
  return Contact.findOne({ _id: id })
}

const createContact = ({ name, email, phone, favorite, ownerId }) => {
  return Contact.create({ name, email, phone, favorite, ownerId })
}

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true })
}

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id })
}

module.exports = {
  getTotalContacts,
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
}
