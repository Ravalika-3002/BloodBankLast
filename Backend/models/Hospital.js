const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  hospitalName: String,
  licenseNumber: String,
  email: { type: String, unique: true },
  password: String,

  city: String,

  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number],
      required: false
    }
  },

  status: { type: String, default: "pending" },
  role: { type: String, default: "hospital" }
});

hospitalSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Hospital", hospitalSchema);
