const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  // USER REQUEST (optional for emergency)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  // HOSPITAL THAT HANDLES REQUEST
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  bloodGroup: {
    type: String,
    required: true
  },

  // TOTAL REQUIRED
  unitsRequired: {
    type: Number,
    required: true
  },

  // 🔥 TRACK COLLECTED UNITS
  unitsCollected: {
    type: Number,
    default: 0
  },

  // 🔥 REQUEST TYPE
  requestType: {
    type: String,
    enum: ["user", "emergency"],
    default: "user"
  },

  // 🔥 REQUEST STATUS
  status: {
    type: String,
    enum: [
      "pending",
      "partially_fulfilled",
      "fulfilled",
      "cancelled"
    ],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);
