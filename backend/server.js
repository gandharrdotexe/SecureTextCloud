const express = require("express");
const cors = require("cors");


const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const messageRoutes = require("./routes/messages");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Security Middleware
// Replace this:

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/messages", messageRoutes);

// Error Handler
app.use(errorHandler);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
