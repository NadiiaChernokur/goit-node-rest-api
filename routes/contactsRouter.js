import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  favoriteContact,
} from "../controllers/contactsControllers.js";
import { isValidId, isValidToken } from "../helpers/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", isValidToken, getAllContacts);

contactsRouter.get("/:id", isValidToken, isValidId, getOneContact);

contactsRouter.delete("/:id", isValidToken, isValidId, deleteContact);

contactsRouter.post("/", isValidToken, createContact);

contactsRouter.put("/:id", isValidToken, isValidId, updateContact);

contactsRouter.patch("/:id/favorite", isValidToken, isValidId, favoriteContact);

export default contactsRouter;
