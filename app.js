const express = require("express");
const connectToDatabase = require("./data/database");
const routes = require("./routes/routes"); // Import your routes
const path = require("path");
const methodOverride = require("method-override");

const app = express();

// Connect to MongoDB
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Routes
app.use("/", routes); // Mount your routes
app.use(methodOverride("_method"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
