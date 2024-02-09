import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouters.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const filename = fileURLToPath(import.meta.url);
const urlString = dirname(filename);

const tempDir = path.join(urlString, "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
});
const upload = multer({
  storage: multerConfig,
});

dotenv.config();
const { DB_HOST } = process.env;
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000);
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);
app.post("/api/avatar", upload.single("avatar"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
});

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.message.includes("E11000")) {
    return res.status(409).json({ Messege: "Email in use" });
  }
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
