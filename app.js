require("dotenv").config();
const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

//database connection
const connectDB = require("./database/connect");

// Routers
const authRouter = require("./routes/auth");
const medicineRouter = require("./routes/medicine");

// middlewares
const authenticatedUser = require("./middlewares/authentication");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");

app.use(express.json());

// Trust first proxy (required for correct client IPs on Render)
app.set("trust proxy", 1);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests! Please try again later",
  })
);
app.use(helmet());
app.use(cors());

// public medicine route
app.use("/api/v1/medicine", medicineRouter);

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/medicine", authenticatedUser, medicineRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the Pharmacy Inventory API");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`This server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Database connection failed:", error);
  }
};

start();
