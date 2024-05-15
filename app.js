import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const { DB_URI, PORT } = process.env;

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT || 3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(`Database connection failure: ${error.message}`);
    process.exit(1);
  });
