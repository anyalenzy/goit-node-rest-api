import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const owner = req.user.id;
    const filter = { owner };
    if (favorite !== undefined) {
      filter.favorite = favorite;
    }
    const data = await Contact.find(filter).skip(skip).limit(limit);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Contact.findOne({ _id: id, owner: req.user.id });
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
    const data = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
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
    const owner = req.user.id;
    console.log(req.user);
    const data = await Contact.create({ ...req.body, owner });
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
    const data = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,
      {
        new: true,
      }
    );
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
    const data = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { favorite },
      { new: true }
    );
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
