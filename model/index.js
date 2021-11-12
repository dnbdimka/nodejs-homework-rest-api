const fs = require('fs/promises')
// const contacts = require('./contacts.json')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const contactsPath = path.join(__dirname, './contacts.json')

const handleError = (e) => {
  throw e
}
const listContacts = async () => {
  try {
    const list = await fs.readFile(contactsPath, 'utf-8')
    return JSON.parse(list)
  } catch (error) {
    handleError(error)
  }
}

const getContactById = async (contactId) => {
  try {
    const contactsList = await listContacts()
    return contactsList.find((contact) => contact.id === contactId)
  } catch (error) {
    handleError(error)
  }
}

const addContact = async (body) => {
  if (body.error) {
    return { error: body.error.details[0].message }
  }
  try {
    const contactsList = await listContacts()
    const newContact = {
      ...body.value,
    }
    newContact.id = uuidv4()
    contactsList.push(newContact)
    await fs.writeFile(contactsPath, JSON.stringify(contactsList))
    return newContact
  } catch (error) {
    handleError(error)
  }
}

const removeContact = async (contactId) => {
  try {
    const contactsList = await listContacts()
    const newList = contactsList.filter((contact) => contact.id !== contactId)
    await fs.writeFile(contactsPath, JSON.stringify(newList))
    if (contactsList.length === newList.length) {
      return false
    }
    return true
  } catch (error) {
    handleError(error)
  }
}

const updateContact = async (contactId, body) => {
  if (body.error) {
    return { error: body.error.details[0].message }
  }
  try {
    const contactsList = await listContacts()
    const updateList = contactsList.map((contact) => {
      if (contact.id === contactId) {
        return { ...contact, ...body.value }
      }
      return contact
    })
    await fs.writeFile(contactsPath, JSON.stringify(updateList))
    const currentContact = updateList.find(
      (contact) => contact.id === contactId
    )
    return currentContact
  } catch (error) {
    handleError(error)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
