/**
 * Backend server entry point.
 * Sets up middleware, connects to the database, applies routes,
 * and starts the Express application.
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

// Load environment configuration and establish the DB connection
dotenv.config();
connectDB();

const app = express();

// Configure allowed origins for CORS requests
const allowedOrigins = [
  "http://localhost:5173",
  "https://taskflow-frontend-beige.vercel.app",
  "https://taskflow-frontend.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// Parse JSON request bodies and log HTTP requests
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {  
  res.json({ message: "TaskFlow API is running" });
});

// Mount API routers
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});