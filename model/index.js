const { MongoClient, ObjectID } = require('mongodb')
require('dotenv').config()
const uriDb = process.env.DB_HOST

// const contactsPath = path.join(__dirname, "./contacts.json");

const handleError = (e) => {
  throw e
}

const listContacts = async () => {
  const client = await new MongoClient(uriDb, {
    useUnifiedTopology: true,
  }).connect()

  try {
    const results = await client
      .db('db-contacts')
      .collection('contacts')
      .find()
      .toArray()
    return results
  } catch (error) {
    handleError(error)
  } finally {
    await client.close()
  }
}

const getContactById = async (contactId) => {
  const client = await new MongoClient(uriDb, {
    useUnifiedTopology: true,
  }).connect()
  const objectId = new ObjectID(contactId)
  try {
    const results = await client
      .db('db-contacts')
      .collection('contacts')
      .find({ _id: objectId })
      .toArray()

    console.log(results)

    return results
  } catch (error) {
    handleError(error)
  } finally {
    await client.close()
  }
}

// const addContact = async (body) => {
//   if (body.error) {
//     return { error: body.error.details[0].message };
//   }
//   try {
//     const contactsList = await listContacts();
//     const newContact = {
//       ...body.value,
//     };
//     newContact.id = uuidv4();
//     contactsList.push(newContact);
//     await fs.writeFile(contactsPath, JSON.stringify(contactsList));
//     return newContact;
//   } catch (error) {
//     handleError(error);
//   }
// };

// const removeContact = async (contactId) => {
//   try {
//     const contactsList = await listContacts();
//     const newList = contactsList.filter((contact) => contact.id !== contactId);
//     await fs.writeFile(contactsPath, JSON.stringify(newList));
//     if (contactsList.length === newList.length) {
//       return false;
//     }
//     return true;
//   } catch (error) {
//     handleError(error);
//   }
// };

// const updateContact = async (contactId, body) => {
//   if (body.error) {
//     return { error: body.error.details[0].message };
//   }
//   try {
//     const contactsList = await listContacts();
//     const updateList = contactsList.map((contact) => {
//       if (contact.id === contactId) {
//         return { ...contact, ...body.value };
//       }
//       return contact;
//     });
//     await fs.writeFile(contactsPath, JSON.stringify(updateList));
//     const currentContact = updateList.find(
//       (contact) => contact.id === contactId
//     );
//     return currentContact;
//   } catch (error) {
//     handleError(error);
//   }
// };

module.exports = {
  listContacts,
  getContactById,
  // removeContact,
  // addContact,
  // updateContact,
}
