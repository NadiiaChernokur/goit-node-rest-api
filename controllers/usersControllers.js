import { User } from "../db/user.js";
import {
  createUserSchema,
  updateSubscription,
} from "../schemas/userSchemas.js";
import RegisterHttpError from "../helpers/RegisterHttpError.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const { SECRET_KEY } = process.env;

export const createUser = async (req, res, next) => {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) throw RegisterHttpError(error);
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const { subscription } = await User.create({
      ...req.body,
      avatarURL,
      password: hashPassword,
    });

    res.status(201).json({ user: { email, subscription, avatarURL } });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) throw RegisterHttpError(error);
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw HttpError(401, "Email or password is wrong");
    const comparePassword = bcrypt.compare(password, user.password);
    if (!comparePassword) throw HttpError(401, "Email or password is wrong");

    const payload = { id: user._id };
    const { subscription } = user;
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({ token: token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};
export const logoutUser = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({ messege: "No Content" });
};

export const getUser = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

export const changeSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (Object.keys(req.body).length === 0)
      throw HttpError(400, "missing field Subscription");

    const { error } = updateSubscription.validate(req.body);
    if (error)
      throw HttpError(
        400,
        "Choose one of three values: 'starter', 'pro', 'business'"
      );

    const update = await User.findByIdAndUpdate(_id, req.body, { new: true });
    if (!update) throw HttpError(404);

    res.json({ message: "Subscription updated successfully" });
  } catch (error) {
    next(error);
  }
};
