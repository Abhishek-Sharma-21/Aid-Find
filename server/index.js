import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import donorRegister from "./routes/donor-register.js";
import { connectDb } from "./database/db.js";
import adminsignUp from "./routes/admin.routes.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the api");
});
app.use("/api", donorRegister);
app.use("/api", adminsignUp);

const port = process.env.PORT || 3000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
