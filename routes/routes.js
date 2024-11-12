const express = require("express");
const router = express.Router();
const Student = require("../model/students"); // Ensure this path is correct
const StudentHistory = require("../model/studentHistory"); // Adjust the path as needed
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

// Soft delete student route
router.delete("/students/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).send("Student not found");

    // Mark the student as deleted
    student.isDeleted = true;
    student.deletedAt = new Date();
    await student.save();

    console.log("Student soft-deleted successfully");
    res.redirect("/");
  } catch (error) {
    console.error("Error soft-deleting student:", error);
    res.status(500).send("Server error");
  }
});

// Recycle Bin route: Display soft-deleted students
router.get("/recyclebin", async (req, res) => {
  try {
    const deletedStudents = await Student.find({ isDeleted: true }).lean();
    res.render("recycleBin", { students: deletedStudents });
  } catch (error) {
    console.error("Error fetching deleted students:", error);
    res.status(500).send("Server error");
  }
});

// Restore route
router.post("/students/restore/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student || !student.isDeleted)
      return res.status(404).send("Student not found in recycle bin");

    student.isDeleted = false;
    student.deletedAt = null;
    await student.save();

    // Record restoration in student history
    const studentHistory = new StudentHistory({
      studentId: student._id,
      data: student.toObject(),
      operation: "restored",
    });
    await studentHistory.save();

    res.redirect("/recyclebin");
  } catch (error) {
    console.error("Error restoring student:", error);
    res.status(500).send("Server error");
  }
});
// Permanently delete a student from the recycle bin
router.post("/students/delete-permanent/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    await Student.findByIdAndDelete(studentId);
    console.log("Student permanently deleted");
    res.redirect("/recyclebin");
  } catch (error) {
    console.error("Error permanently deleting student:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
