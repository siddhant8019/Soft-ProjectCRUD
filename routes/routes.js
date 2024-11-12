const express = require("express");
const router = express.Router();
const Student = require("../model/students"); // Ensure this path is correct
const upload = require("../middleware/upload"); // Adjust path as needed

const methodOverride = require("method-override");

router.use(methodOverride("_method"));

router.get("/", async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find().lean(); // Using lean() for plain JavaScript objects

    // Render home.ejs with the fetched student data
    res.render("home", { students: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    // Handle error gracefully
    res.render("home", { errorMessage: "Error fetching students" });
  }
});
router.post("/addstudent", upload.single("picture"), async (req, res) => {
  try {
    const { name, email, class: classInfo, category } = req.body;
    const picture = req.file ? "/images/" + req.file.filename : "";

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

    // Redirect to a success page or home page
    res.redirect("/");
  } catch (error) {
    console.error("Error saving student:", error);
    res.status(500).send("Server error");
  }
});
router.post("/students/edit", upload.single("picture"), async (req, res) => {
  const { id, name, email, class: classInfo, category } = req.body;
  let picture = req.body.existingPicture; // Initialize with existing picture path
  if (req.file) {
    picture = "/images/" + req.file.filename; // Update with new picture path if file uploaded
  }

  try {
    // Find the student by ID
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Update student fields only if they are present in req.body
    if (name) {
      student.name = name;
    }
    if (email) {
      student.email = email;
    }
    if (classInfo) {
      student.class = classInfo;
    }
    if (category) {
      student.category = category;
    }
    if (picture) {
      student.picture = picture;
    }

    // Save updated student document
    await student.save();
    console.log("Student updated successfully");

    // Redirect to home page or student list page
    res.redirect("/");
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).send("Server error");
  }
});

// Delete student route
router.delete("/students/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    // Find the student by ID and delete
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    res.redirect("/");
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
