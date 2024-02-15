import { User } from "../db/user.js";
import {
  createUserSchema,
  emailUserSchema,
  updateSubscription,
} from "../schemas/userSchemas.js";
import RegisterHttpError from "../helpers/RegisterHttpError.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendEmail } from "../helpers/verifyUser.js";

dotenv.config();
const { SECRET_KEY, BASE_URL } = process.env;

export const createUser = async (req, res, next) => {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) throw RegisterHttpError(error);
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const { subscription } = await User.create({
      ...req.body,
      avatarURL,
      verificationToken,
      password: hashPassword,
    });
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };
    await sendEmail(verifyEmail);
    res.status(201).json({ user: { email, subscription, avatarURL } });
  } catch (error) {
    next(error);
  }
};
export const toVerifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) throw HttpError(401, "Email not found");
    await User.findByIdAndUpdate(user_id),
      { verify: true, verificationToken: "" };
    res.json({ messege: "Verification successful " });
  } catch (error) {
    next(error);
  }
};
export const resendVerifyUser = async (req, res, next) => {
  try {
    const { error } = emailUserSchema(req.body);
    if (error) throw RegisterHttpError(error);
    const { email } = req.body;
    const user = User.findOne({ email });
    if (!user) throw HttpError(401, "Email not found");
    if (user.verify) throw HttpError(401, "Email alredy verify");
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };
    await sendEmail(verifyEmail);
    res.json({ messege: "Verify email send success" });
  } catch (error) {}
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
    if (!user.verify) throw HttpError(401, "Email not verified");

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
