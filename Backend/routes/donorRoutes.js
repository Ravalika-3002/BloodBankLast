const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const Donation = require("../models/Donation");
const DonorRequest = require("../models/DonorRequest");

/* ================= ACCEPT REQUEST ================= */
router.put("/request/:id/accept", protect(["donor"]), async (req, res) => {
  const donorRequest = await DonorRequest.findOne({
    _id: req.params.id,
    donorId: req.user._id
  }).populate("requestId");

  if (!donorRequest) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (donorRequest.requestId.archived) {
    return res.status(400).json({
      message: "Request is closed"
    });
  }

  if (donorRequest.status !== "pending") {
    return res.status(400).json({
      message: "Request already processed"
    });
  }

  const lastDonation = await Donation.findOne({
    donorId: req.user._id
  }).sort({ donatedAt: -1 });

  if (lastDonation?.donatedAt) {
    const days =
      (Date.now() - new Date(lastDonation.donatedAt)) /
      (1000 * 60 * 60 * 24);

    if (days < 90) {
      return res.status(400).json({
        message: `You can donate after ${Math.ceil(90 - days)} days`
      });
    }
  }

  donorRequest.status = "accepted";
  await donorRequest.save();

  res.json({ message: "Request accepted" });
});

/* ================= REJECT REQUEST ================= */
router.put("/request/:id/reject", protect(["donor"]), async (req, res) => {
  const donorRequest = await DonorRequest.findOne({
    _id: req.params.id,
    donorId: req.user._id
  }).populate("requestId");

  if (!donorRequest) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (donorRequest.requestId.archived) {
    return res.status(400).json({
      message: "Request is closed"
    });
  }

  if (donorRequest.status !== "pending") {
    return res.status(400).json({
      message: "Request already processed"
    });
  }

  donorRequest.status = "rejected";
  donorRequest.rejectionReason =
    req.body.reason || "Not available";

  await donorRequest.save();

  res.json({ message: "Request rejected" });
});

/* ================= VIEW DONOR REQUESTS ================= */
router.get("/requests", protect(["donor"]), async (req, res) => {
  const requests = await DonorRequest.find({
    donorId: req.user._id
  }).populate("requestId");

  res.json(requests);
});

/* ================= VIEW DONOR DONATIONS ================= */
router.get("/donations", protect(["donor"]), async (req, res) => {
  const donations = await Donation.find({
    donorId: req.user._id
  })
    .populate("hospitalId", "hospitalName city")
    .sort({ donatedAt: -1 });

  res.json(donations);
});

module.exports = router;
