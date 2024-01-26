import mongoose from "mongoose";

// p7YB6b10Tbw8zq4v;
const DB_HOST =
  "mongodb+srv://Nadiia:p7YB6b10Tbw8zq4v@nich.zuifzce.mongodb.net/db-contacts?retryWrites=true&w=majority";
mongoose
  .connect(DB_HOST)
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.log(error.message));
