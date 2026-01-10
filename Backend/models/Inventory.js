const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"   // 🔥 REQUIRED
  },
  bloodGroup: String,
  quantity: Number
});

module.exports = mongoose.model("Inventory", inventorySchema);
