import express from "express";
import {
  changeSubscription,
  createUser,
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

export default usersRouter;
