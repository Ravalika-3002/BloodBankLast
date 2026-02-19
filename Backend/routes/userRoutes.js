const express = require("express");
const Hospital = require("../models/Hospital");
const Inventory = require("../models/Inventory");
const Request = require("../models/Request");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

/* =========================
   CREATE BLOOD REQUEST
========================= */
router.post("/request", protect(["user"]), async (req, res) => {
  const { hospitalId, bloodGroup, unitsRequired } = req.body;

  if (!units || units <= 0) {
    return res.status(400).json({ message: "Invalid units" });
  }

  await Request.create({
    userId: req.user.id,
    hospitalId,
    bloodGroup,
    unitsRequired
  });

  res.json({ message: "Blood request sent" });
});

/* =========================
   SEARCH BLOOD
========================= */
router.get("/search", protect(["user"]), async (req, res) => {
  const { lat, lng, bloodGroup } = req.query;

  let hospitals = [];

  // 1️⃣ CURRENT LOCATION (GPS)
  if (lat && lng) {
    hospitals = await Hospital.find({
      status: "approved",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: 5000   // 5 km
        }
      }
    });
  } 
  // 2️⃣ FALLBACK → REGISTERED USER LOCATION
  else {
    const user = await User.findById(req.user.id);

    if (user?.location?.coordinates?.length === 2) {
      hospitals = await Hospital.find({
        status: "approved",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: user.location.coordinates
            },
            $maxDistance: 5000
          }
        }
      });
    } else if (user?.city) {
      hospitals = await Hospital.find({
        status: "approved",
        city: user.city
      });
    }
  }

  // 3️⃣ FILTER INVENTORY
  const inventory = await Inventory.find({
    hospitalId: { $in: hospitals.map(h => h._id) },
    bloodGroup,
    quantity: { $gt: 0 }
  }).populate("hospitalId", "hospitalName email city");

  res.json(inventory);
});

module.exports = router;
