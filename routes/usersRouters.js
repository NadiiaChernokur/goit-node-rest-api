import express from "express";
import {
  createUser,
  getUser,
  loginUser,
  logoutUser,
} from "../controllers/usersControllers.js";
import { isValidToken } from "../helpers/validateBody.js";

const usersRouter = express.Router();
usersRouter.post("/register", createUser);
usersRouter.post("/login", loginUser);
usersRouter.post("/logout", isValidToken, logoutUser);
usersRouter.get("/current", isValidToken, getUser);

export default usersRouter;
