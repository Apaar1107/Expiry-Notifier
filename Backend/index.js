const express = require("express");
require("dotenv").config();
const cookie = require("cookie-parser");
const dbConnect = require("./config/database");
const recordRoutes = require("./routes/record");
const storeRoutes = require("./routes/store");
const cors = require("cors");
const path = require("path");
const cron = require("./utils/cron-job");

const app = express();
const PORT = process.env.PORT || 8000;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie());

// CORS Configuration
app.use(
    cors({
      origin:"https://expiry-notifier-b6ci.onrender.com",
      credentials: true,
    })
);

// Connect to Database
dbConnect();

// Routes
app.use("/api/v1/record", recordRoutes);
app.use("/api/v1/store", storeRoutes);

// Serve Frontend Files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});


// Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`The server is up and running at port ${PORT}`);
});
