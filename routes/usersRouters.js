import express from "express";
import {
  changeSubscription,
  createUser,
  getAvatar,
  getUser,
  loginUser,
  logoutUser,
} from "../controllers/usersControllers.js";
import { isValidToken } from "../helpers/isValidToken.js";

const usersRouter = express.Router();
usersRouter.patch("/", isValidToken, changeSubscription);
usersRouter.post("/register", createUser);
usersRouter.post("/login", loginUser);
usersRouter.post("/logout", isValidToken, logoutUser);
usersRouter.get("/current", isValidToken, getUser);
usersRouter.get("/avatars", isValidToken, getAvatar);

export default usersRouter;
