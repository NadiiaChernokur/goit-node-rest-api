// import fs from "fs/promises";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const contactsPath = path.resolve(__dirname, "../db/contacts.json");

// export async function listContacts() {
//   const allContacts = await fs.readFile(contactsPath);
//   return JSON.parse(allContacts);
// }

// export async function getContactById(contactId) {
//   const contacts = await listContacts();
//   const contactById = contacts.find((item) => item.id === contactId);
//   return contactById;
// }

// export async function removeContact(contactId) {
//   const contacts = await listContacts();
//   const removeById = contacts.findIndex((item) => item.id === contactId);
//   if (removeById === -1) return null;
//   const [result] = contacts.splice(removeById, 1);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return result;
// }

// export async function addContact(name, email, phone) {
//   const contacts = await listContacts();
//   const newContact = {

//     name,
//     email,
//     phone,
//   };
//   contacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return newContact;
// }

// export async function toUpdateContact(id, name, email, phone) {
//   const contacts = await listContacts();
//   const contactById = contacts.find((item) => item.id === id);
//   if (contactById === -1) return null;
//   contacts[contactById] = {
//     id,
//     name,
//     email,
//     phone,
//   };
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return contacts[contactById];
// }
