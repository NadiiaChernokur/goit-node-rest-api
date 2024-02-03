import { User } from "../db/user.js";
import { createUserSchema } from "../schemas/contactsSchemas.js";
import RegisterHttpError from "../helpers/RegisterHttpError.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const { SECRET_KEY } = process.env;

export const createUser = async (req, res, next) => {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) throw RegisterHttpError(error);
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const { email, subscription } = await User.create({
      ...req.body,
      password: hashPassword,
    });
    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw HttpError(401, "Email or password is wrong");
    const comparePassword = bcrypt.compare(password, user.password);
    if (!comparePassword) throw HttpError(401, "Email or password is wrong");

    const payload = { id: user._id };
    const { subscription } = user;
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

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
  //   await User.findByIdAndUpdate(_id, { token: "" });
  res.status(200).json({ email, subscription });
};