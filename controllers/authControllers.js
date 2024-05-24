import bcrypt from "bcrypt";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.status(200).json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    if (
      Object.keys(req.body).length !== 1 ||
      Object.keys(req.body)[0] !== "subscription"
    ) {
      return next(HttpError(400, "Body must have one field: subscription"));
    }
    const { subscription: updatedSubscription } = req.body;
    const data = await User.findByIdAndUpdate(
      req.user.id,
      { subscription: updatedSubscription },
      { new: true }
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
