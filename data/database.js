const mongoose = require("mongoose");
const Student = require("../model/students"); // Adjust the path as needed

// MongoDB connection URI
const uri = "mongodb://0.0.0.0:27017/sreng_project";

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

async function addStudent(name, email, classInfo, category, picture) {
  try {
    // Create a new student document
    const newStudent = new Student({
      name: name,
      email: email,
      class: classInfo,
      category: category,
      picture: picture,
    });

    // Save the new student document to the database
    await newStudent.save();
    console.log("Student saved successfully");
  } catch (err) {
    console.error("Error saving student:", err);
    throw err; // Propagate the error
  }
}

module.exports = addStudent;
connectToDatabase();
