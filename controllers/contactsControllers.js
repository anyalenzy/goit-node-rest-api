import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const data = await contactsServices.listContacts();
  res.json(data);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsServices.getContactById(id);
    if (!data) {
      throw HttpError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsServices.removeContact(id);
    if (!data) {
      throw HttpError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const data = await contactsServices.addContact(name, email, phone);
  res.status(201).json(data);
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, `Body must have at least one field`);
    }
    const data = await contactsServices.updateContact(id, req.body);
    if (!data) {
      throw HttpError(404);
    }
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
