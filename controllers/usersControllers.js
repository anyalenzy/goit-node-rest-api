import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

import User from "../models/user.js";

export const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(HttpError(400, "Avatar file was not found"));
    }
    const { path: tempUploadPath, filename } = req.file;

    const newPath = path.resolve("public", "avatars", filename);

    const image = await Jimp.read(tempUploadPath);
    await image.resize(250, 250).writeAsync(tempUploadPath);

    await fs.rename(tempUploadPath, newPath);
    const avatarURL = `/avatars/${filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: avatarURL },
      { new: true }
    );

    res.status(200).json({ id: user._id, avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
