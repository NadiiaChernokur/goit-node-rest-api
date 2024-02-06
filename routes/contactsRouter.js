import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  favoriteContact,
} from "../controllers/contactsControllers.js";

import { isValidId } from "../helpers/isValidId.js";
import { isValidToken } from "../helpers/isValidToken.js";
import { isOwnerValid } from "../helpers/isOwnerValid.js";

const contactsRouter = express.Router();

contactsRouter.get("/", isValidToken, getAllContacts);

contactsRouter.get(
  "/:id",
  isValidToken,
  isValidId,
  isOwnerValid,
  getOneContact
);

contactsRouter.delete(
  "/:id",
  isValidToken,
  isValidId,
  isOwnerValid,
  deleteContact
);

contactsRouter.post("/", isValidToken, createContact);

contactsRouter.put(
  "/:id",
  isValidToken,
  isValidId,
  isOwnerValid,
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidToken,
  isValidId,
  isOwnerValid,
  favoriteContact
);

export default contactsRouter;
