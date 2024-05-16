import mongoose from "mongoose";
import HttpError from "./HttpError.js";

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(HttpError(400, "Invalid contact id"));
  }
  next();
};

export default validateObjectId;
