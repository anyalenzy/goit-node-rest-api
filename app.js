import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const DB_URI = process.env.DB_URI;

async function run() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connection successful");
  } catch (error) {
    console.log(`Database connection failure: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

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

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});

run().catch(console.error);
