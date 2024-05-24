import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
  paginationSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../helpers/validateBody.js";
import validateObjectId from "../helpers/validateObjectId.js";
import validateQuery from "../helpers/validateQuery.js";
import auth from "../middlewares/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, validateQuery(paginationSchema), getAllContacts);

contactsRouter.get("/:id", auth, validateObjectId, getOneContact);

contactsRouter.delete("/:id", auth, validateObjectId, deleteContact);

contactsRouter.post(
  "/",
  auth,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  auth,
  validateObjectId,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  auth,
  validateObjectId,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

export default contactsRouter;
