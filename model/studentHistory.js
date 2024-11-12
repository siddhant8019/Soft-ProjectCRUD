const mongoose = require("mongoose");

const studentHistorySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  data: Object,
  operation: String, // "created", "modified", "deleted", or "restored"
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StudentHistory", studentHistorySchema);
