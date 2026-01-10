const express = require("express");
const Donation = require("../models/Donation");
const protect = require("../middleware/auth");

const router = express.Router();

// VIEW MY DONATIONS
router.get("/donations", protect(["donor"]), async (req, res) => {
  const donations = await Donation.find({
    donorId: req.user.id
  })
    .populate("hospitalId", "hospitalName city")
    .sort({ donatedAt: -1 });

  res.json(donations);
});

module.exports = router;
