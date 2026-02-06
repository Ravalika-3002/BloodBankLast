const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const Donation = require("../models/Donation");
const Donor = require("../models/Donor");
const Inventory = require("../models/Inventory");
const BloodRequest = require("../models/BloodRequest");
const DonorRequest = require("../models/DonorRequest");

/* ================= CREATE REQUEST ================= */
router.post("/request-based-donation", protect(["hospital"]), async (req, res) => {
  const { bloodGroup, unitsRequired, urgency } = req.body;

  if (!bloodGroup || unitsRequired <= 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const inventory = await Inventory.findOne({
    hospitalId: req.user._id,
    bloodGroup
  });

  if (inventory && inventory.quantity >= unitsRequired) {
    return res.status(400).json({
      message: "Sufficient inventory available"
    });
  }

  const request = await BloodRequest.create({
    hospitalId: req.user._id,
    bloodGroup,
    unitsRequired,
    urgency: urgency || "normal"
  });

  const donors = await Donor.find({ bloodGroup });

  for (const donor of donors) {
    await DonorRequest.create({
      requestId: request._id,
      donorId: donor._id,
      eligibleAtThatTime: true,
      status: "pending"
    });
  }

  res.json({ message: "Request created" });
});

/* ================= GET HOSPITAL REQUESTS ================= */
router.get("/requests", protect(["hospital"]), async (req, res) => {
  const requests = await BloodRequest.find({
    hospitalId: req.user._id,
    archived: false
  }).sort({ createdAt: -1 });

  res.json(requests);
});

/* ================= GET DONORS ================= */
router.get("/request/:id/donors", protect(["hospital"]), async (req, res) => {
  const donors = await DonorRequest.find({
    requestId: req.params.id
  }).populate("donorId", "name bloodGroup phone");

  res.json(donors);
});

/* ================= RECORD DONATION ================= */
router.post("/donation", protect(["hospital"]), async (req, res) => {
  const { donorId, bloodGroup, requestId } = req.body;

  const request = await BloodRequest.findById(requestId);
  if (!request || request.archived) {
    return res.status(400).json({ message: "Request closed" });
  }

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

  request.unitsCollected += 1;
  if (request.unitsCollected >= request.unitsRequired) {
    request.status = "fulfilled";

    await DonorRequest.updateMany(
      { requestId },
      {
        $set: {
          status: "rejected",
          rejectionReason: "Request completed"
        }
      }
    );
  } else {
    request.status = "partially_fulfilled";
  }

  await request.save();

  res.json({ message: "Donation recorded" });
});

/* ================= REMOVE REQUEST (ALL CASES) ================= */
router.put("/request/:id/remove", protect(["hospital"]), async (req, res) => {
  const request = await BloodRequest.findOne({
    _id: req.params.id,
    hospitalId: req.user._id
  });

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  request.archived = true;

  const reason =
    request.status === "fulfilled"
      ? "Request completed"
      : "Request closed by hospital";

  await DonorRequest.updateMany(
    { requestId: request._id },
    {
      $set: {
        status: "rejected",
        rejectionReason: reason
      }
    }
  );

  await request.save();

  res.json({ message: "Request removed from hospital list" });
});

module.exports = router;
