const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  city: String,

  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number], // [lng, lat]
      required: false
    }
  },

  role: { type: String, default: "user" }
});

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
