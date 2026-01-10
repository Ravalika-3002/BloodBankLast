const express = require("express");
const mongoose = require("mongoose"); // ✅ REQUIRED
const router = express.Router();

const protect = require("../middleware/auth");
const Donation = require("../models/Donation");
const Donor = require("../models/Donor");
const Inventory = require("../models/Inventory");
const Request = require("../models/Request");

/* ============================
   VIEW BLOOD REQUESTS
============================ */
router.get("/requests", protect(["hospital"]), async (req, res) => {
  const requests = await Request.find({
    hospitalId: req.user._id, // ✅ FIXED
    status: "pending"
  }).populate("userId", "name email city");

  res.json(requests);
});

/* ============================
   ACCEPT REQUEST
============================ */
router.put("/request/:id/accept", protect(["hospital"]), async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  const inventory = await Inventory.findOne({
    hospitalId: req.user._id, // ✅ FIXED
    bloodGroup: request.bloodGroup
  });

  if (!inventory || inventory.quantity < request.units) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  inventory.quantity -= request.units;
  await inventory.save();

  request.status = "approved";
  await request.save();

  res.json({ message: "Request approved" });
});

/* ============================
   DECLINE REQUEST
============================ */
router.put("/request/:id/decline", protect(["hospital"]), async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  request.status = "declined";
  await request.save();

  res.json({ message: "Request declined" });
});

/* ============================
   VIEW HOSPITAL INVENTORY
   (AGGREGATED, NO DUPLICATES)
============================ */
router.get("/inventory", protect(["hospital"]), async (req, res) => {
  const hospitalId = req.user.id;

  const rawInventory = await Inventory.aggregate([
    {
      $match: {
        hospitalId: new mongoose.Types.ObjectId(hospitalId)
      }
    },
    {
      $group: {
        _id: "$bloodGroup",
        units: { $sum: "$quantity" }
      }
    }
  ]);

  const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

  // Convert to map
  const inventoryMap = {};
  rawInventory.forEach(item => {
    inventoryMap[item._id] = item.units;
  });

  // Ensure all blood groups exist
  const finalInventory = BLOOD_GROUPS.map(bg => ({
    bloodGroup: bg,
    units: inventoryMap[bg] || 0
  }));

  res.json(finalInventory);
});
/* ============================
   RECORD DONATION
============================ */
router.post("/donation", protect(["hospital"]), async (req, res) => {
  try {
    const { donorId, bloodGroup, units } = req.body;

    if (!donorId || !bloodGroup || !units || units <= 0) {
      return res.status(400).json({ message: "Invalid donation data" });
    }

    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Save donation record
    await Donation.create({
      donorId,
      hospitalId: req.user._id, // ✅ FIXED
      bloodGroup,
      units
    });

    // Update inventory
    let inventory = await Inventory.findOne({
      hospitalId: req.user._id,
      bloodGroup
    });

    if (!inventory) {
      inventory = new Inventory({
        hospitalId: req.user._id,
        bloodGroup,
        quantity: units
      });
    } else {
      inventory.quantity += units;
    }

    await inventory.save();

    res.json({ message: "Donation recorded and inventory updated" });
  } catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ message: "Failed to record donation" });
  }
});

/* ============================
   VIEW DONATIONS RECEIVED
============================ */
router.get("/donations", protect(["hospital"]), async (req, res) => {
  const donations = await Donation.find({
    hospitalId: req.user._id // ✅ FIXED
  })
    .populate("donorId", "name email bloodGroup city")
    .sort({ donatedAt: -1 });

  res.json(donations);
});

/* ============================
   GET DONORS
============================ */
router.get("/donors", protect(["hospital"]), async (req, res) => {
  const donors = await Donor.find()
    .select("name email bloodGroup city location");

  res.json(donors);
});

module.exports = router;
