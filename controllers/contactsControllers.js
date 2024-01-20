import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  toUpdateContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    res.json(HttpError(404));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) throw HttpError(404);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteContact = await removeContact(id);
    if (!deleteContact) throw HttpError(404);
    res.json(deleteContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) throw HttpError(400);
    const { name, email, phone } = req.body;
    const result = await addContact(name, email, phone);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw HttpError(404);

    if (Object.keys(req.body).length === 0)
      throw HttpError(400, "Body must have at least one field");

    const { error } = createContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { name, email, phone } = req.body;
    const update = await toUpdateContact(id, name, email, phone);
    if (!update) throw HttpError(404);
    res.json(update);
  } catch (error) {
    next(error);
  }
};
