import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const data = await Contact.find();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Contact.findById(id);
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
    const data = await Contact.findByIdAndDelete(id);
    if (!data) {
      throw HttpError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const data = await Contact.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, `Body must have at least one field`);
    }
    const data = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) {
      throw HttpError(404);
    }
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const data = await Contact.findByIdAndUpdate(id, favorite, { new: true });
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
