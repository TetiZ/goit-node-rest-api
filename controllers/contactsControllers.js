import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);

    if (!contact) throw HttpError(404, messageList[404]);

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);

    if (!contact) throw HttpError(404, messageList[404]);

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = req.body;

    if (typeof error !== "undefined") throw HttpError(400, error.message);

    if (!contact) throw HttpError(404, messageList[404]);

    const newContact = await contactsService.addContact(contact);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = req.body;
    const { id } = req.params;

    if (typeof error !== "undefined") throw HttpError(400, error.message);

    if (!contact) throw HttpError(404, messageList[404]);

    await contactsService.updateContact(id, contact);
    res.status(200).send({ id, contact });
  } catch (error) {
    next(error);
  }
};
