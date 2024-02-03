import HttpError from "./HttpError.js";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../db/user.js";
import dotenv from "dotenv";
dotenv.config();

const { SECRET_KEY } = process.env;

export const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(400, `${id} is not valid`));
  }
  next();
};

export const isValidToken = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const findUser = await User.findById(id);

    if (!findUser) {
      next(HttpError(401));
    }
    req.user = findUser;
    next();
  } catch {
    next(HttpError(401));
  }
};
