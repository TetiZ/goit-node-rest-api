import contactsService from "../services/contactsServices.js";
import express from "express";

import { createContactSchema } from "../schemas/contactsSchemas.js";

const app = express();

const jsonParser = express.json();

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

app.get("/api/contacts", jsonParser, getAllContacts);

app.listen(8090, () => {
  console.log("Server started on port 8090");
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("Internal Server Error");
});

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = contactsService.getContactById(id);

    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

app.get("/api/contacts/:id", jsonParser, getOneContact);

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = contactsService.removeContact(id);

    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

app.delete("/api/contacts/:id", jsonParser, deleteContact);

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const { error, value } = createContactSchema.validate(contact, {
      convert: false,
    });

    const newContact = await contactsService.addContact(contact);

    if (typeof error !== "undefined") {
      return res.status(400).send({ message: "Validation error" });
    }
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

app.post("/api/contacts", jsonParser, createContact);

export const updateContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const { id } = req.params;

    if (!contact.name || !contact.email || !contact.phone) {
      return res
        .status(400)
        .send({ message: "Body must have at least one field" });
    }

    const { error, value } = createContactSchema.validate(contact, {
      convert: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({ message: "Validation error" });
    }
    await contactsService.updateContact(id, contact);
    res.status(200).send({ id, contact });
  } catch (error) {
    next(error);
  }
};

app.put("/api/contacts/:id", jsonParser, updateContact);
