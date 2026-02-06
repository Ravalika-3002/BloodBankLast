//stop
const mongoose = require("mongoose");

const donorRequestSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodRequest", // ✅ correct
    required: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  rejectionReason: String,
  eligibleAtThatTime: Boolean
});

module.exports = mongoose.model("DonorRequest", donorRequestSchema);
