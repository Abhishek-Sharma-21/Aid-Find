import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDb } from "./database/db.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import requestRoutes from "./routes/request.routes.js";

const app = express();
// Allow access from the production frontend URL or fallback to localhost for development
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
// Vercel Serverless Function Architecture
// We export the app and don't rely on app.listen for Vercel

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the api (Vercel Serverless Ready)");
});

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);

// Only listen locally, Vercel uses the exported app
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  connectDb().then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });
}

export default app;
