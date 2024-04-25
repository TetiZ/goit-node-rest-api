import crypto from "node:crypto";
import * as fs from "node:fs/promises";
import path from "path";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    const contacts = JSON.parse(data);
    return contacts;
  } catch (e) {
    return null;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const foundContact = contacts.find((contact) => contact.id === contactId);
    return foundContact ? foundContact : null;
  } catch (e) {
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const idxToRemove = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (idxToRemove === -1) {
      return null;
    } else {
      const deletedContact = contacts.splice(idxToRemove, 1)[0];
      await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
      return deletedContact;
    }
  } catch (e) {
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { id: crypto.randomUUID(), name, email, phone };

    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
    return newContact;
  } catch (e) {
    return null;
  }
}

export default { listContacts, getContactById, removeContact, addContact };
