const mongoose = require("mongoose");

// Define the student schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique in the database
  },
  class: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, // Sets the current date as the default value
  },
  picture: {
    type: String, // Assuming picture will be stored as a URL
    required: false, // Not required, adjust as needed
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

// Create a model based on the schema
const Student = mongoose.model("Student", studentSchema);

// Export the model to use it in other parts of the application
module.exports = Student;
