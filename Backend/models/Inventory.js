//stop
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Inventory", inventorySchema);
