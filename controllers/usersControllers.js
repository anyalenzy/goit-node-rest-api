import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import sendMail from "../helpers/mailSender.js";

import User from "../models/user.js";

const { BASE_URI } = process.env;

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

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return next(HttpError(404, "User not found"));
    }
    await User.findOneAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};
export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(HttpError(404, "User not found"));
    }
    if (user.verify) {
      return next(HttpError(400, "Verification has already been passed"));
    }
    const message = {
      to: email,
      from: "anya.dudnik.91@gmail.com",
      subject: "Resend verify email",
      html: `To confirm your email please click on <a target="_blank" href="${BASE_URI}/api/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm your email please open the link ${BASE_URI}/api/users/verify/${user.verificationToken}`,
    };
    sendMail(message);
    return res.status(201).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};
