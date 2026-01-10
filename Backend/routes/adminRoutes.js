const express = require("express");
const protect = require("../middleware/auth");

const User = require("../models/User");
const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");
const Inventory = require("../models/Inventory");

const router = express.Router();

/* ========================
   HOSPITAL APPROVAL
======================== */
router.get("/pending-hospitals", protect(["admin"]), async (req, res) => {
  const hospitals = await Hospital.find({ status: "pending" });
  res.json(hospitals);
});

router.put("/approve/:id", protect(["admin"]), async (req, res) => {
  await Hospital.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Hospital approved" });
});

router.put("/reject/:id", protect(["admin"]), async (req, res) => {
  await Hospital.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Hospital rejected" });
});

/* ========================
   SYSTEM RECORDS
======================== */
router.get("/users", protect(["admin"]), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.get("/donors", protect(["admin"]), async (req, res) => {
  const donors = await Donor.find().select("-password");
  res.json(donors);
});

router.get("/hospitals", protect(["admin"]), async (req, res) => {
  const hospitals = await Hospital.find().select("-password");
  res.json(hospitals);
});

/* ========================
   INVENTORIES
======================== */
router.get("/inventories", protect(["admin"]), async (req, res) => {
  const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

  const data = await Inventory.aggregate([
    {
      $group: {
        _id: {
          hospitalId: "$hospitalId",
          bloodGroup: "$bloodGroup"
        },
        units: { $sum: "$quantity" }
      }
    },
    {
      $group: {
        _id: "$_id.hospitalId",
        stock: {
          $push: {
            bloodGroup: "$_id.bloodGroup",
            units: "$units"
          }
        }
      }
    },
    {
      $lookup: {
        from: "hospitals",
        localField: "_id",
        foreignField: "_id",
        as: "hospital"
      }
    },
    { $unwind: "$hospital" }
  ]);

  // Normalize: ensure all blood groups exist
  const final = data.map(h => {
    const map = {};
    h.stock.forEach(s => {
      map[s.bloodGroup] = s.units;
    });

    return {
      hospitalId: h._id,
      hospitalName: h.hospital.hospitalName,
      city: h.hospital.city,
      inventory: BLOOD_GROUPS.map(bg => ({
        bloodGroup: bg,
        units: map[bg] || 0
      }))
    };
  });

  res.json(final);
});

module.exports = router;
