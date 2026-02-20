const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");
const Request = require("../models/Request");
const Donation = require("../models/Donation");
const Inventory = require("../models/Inventory");
const BloodRequest = require("../models/BloodRequest");
const DonorRequest = require("../models/DonorRequest");

/* ============================================
   GET USER → HOSPITAL REQUESTS
============================================ */
router.get("/user-requests", protect(["hospital"]), async (req, res) => {
  const requests = await Request.find({
    hospitalId: req.user._id
  })
    .populate("userId", "name city email")
    .sort({ createdAt: -1 });

  res.json(requests);
});

/* ============================================
   GET DONORS NEAR HOSPITAL
============================================ */
router.get("/donors", protect(["hospital"]), async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user._id);

    console.log("🔥 Hospital Document:", hospital);

    let donors = [];

    // 1️⃣ GPS FILTER
    if (
      hospital.location &&
      hospital.location.coordinates &&
      hospital.location.coordinates.length === 2
    ) {
      console.log("📍 Using GPS filter");

      const [lng, lat] = hospital.location.coordinates;

      donors = await Donor.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: 10000
          }
        }
      }).select("name email city bloodGroup location");
    }

    // 2️⃣ CITY FILTER
    if (donors.length === 0 && hospital.city) {
      console.log("🏙 Using CITY filter:", hospital.city);

      donors = await Donor.find({
        city: hospital.city
      }).select("name email city bloodGroup location");
    }

    // 3️⃣ RETURN ALL DONORS IF STILL EMPTY
    if (donors.length === 0) {
      console.log("🌍 No GPS/city match — returning ALL donors");

      donors = await Donor.find().select(
        "name email city bloodGroup location"
      );
    }

    console.log("✅ FINAL DONORS SENT:", donors.length);

    res.json(donors);

  } catch (err) {
    console.error("❌ ERROR in /donors:", err);
    res.status(500).json({ message: "Failed to load donors" });
  }
});
/* ========================
   HOSPITAL INVENTORY
======================== */
router.get("/inventory", protect(["hospital"]), async (req, res) => {
  try {
    const inventory = await Inventory.find({ hospitalId: req.user._id });

    // Convert to bloodGroup → units
    const data = inventory.map((i) => ({
      bloodGroup: i.bloodGroup,
      units: i.quantity
    }));

    res.json(data);

  } catch (err) {
    console.error("Inventory Error:", err);
    res.status(500).json({ message: "Failed to load inventory" });
  }
});


/* ============================================
   RECORD DONATION
============================================ */
router.post("/donation", protect(["hospital"]), async (req, res) => {
  const { donorId, bloodGroup } = req.body;

  await Donation.create({
    donorId,
    hospitalId: req.user._id,
    bloodGroup,
    units: 1
  });

  let inventory = await Inventory.findOne({
    hospitalId: req.user._id,
    bloodGroup
  });

  if (!inventory) {
    inventory = new Inventory({
      hospitalId: req.user._id,
      bloodGroup,
      quantity: 1
    });
  } else {
    inventory.quantity += 1;
  }

  await inventory.save();
  res.json({ message: "Donation recorded" });
});

module.exports = router;
