const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  bloodGroup: String,
  unitsRequired: Number,
  unitsCollected: { type: Number, default: 0 },
  urgency: {
    type: String,
    enum: ["normal", "emergency"],
    default: "normal"
  },
  status: {
    type: String,
    enum: ["pending", "partially_fulfilled", "fulfilled", "cancelled"],
    default: "pending"
  },
  archived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
