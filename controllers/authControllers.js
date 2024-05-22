import bcrypt from "bcrypt";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return next(HttpError(409, "Email in use"));
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: passwordHash });
    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(HttpError(401, "Email or password is wrong"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      next(HttpError(401, "Email or password is wrong"));
    }
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {};
export const getCurrentUser = async (req, res, next) => {};

export const updateSubscription = async (req, res, next) => {
  try {
    const { subscription: updatedSubscription } = req.body;
    const { _id } = req.user;
    const validSubscriptions = ["starter", "pro", "business"];
    if (!validSubscriptions.includes(updatedSubscription)) {
      return next(HttpError(400, "Invalid subscription type"));
    }
    const data = await User.findByIdAndUpdate(
      { _id },
      { subscription: updatedSubscription },
      { new: true }
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
