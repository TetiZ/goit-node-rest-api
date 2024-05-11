import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) throw HttpError(404, messageList[404]);

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) throw HttpError(404, messageList[404]);

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = req.body;

    const newContact = await Contact.create(contact);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = req.body;
    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(id, contact);

    if (!updatedContact) throw HttpError(404, messageList[404]);

    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { favorite } = req.body;
    const { id } = req.params;

    const updatedContactStatus = await Contact.findByIdAndUpdate(id, favorite);

    if (!updatedContactStatus) throw HttpError(404, messageList[404]);

    res.status(200).send(updatedContactStatus);
  } catch (error) {
    next(error);
  }
};
