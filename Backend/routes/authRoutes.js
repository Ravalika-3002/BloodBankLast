const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Hospital = require("../models/Hospital");
const Admin = require("../models/Admin");
const router = express.Router();
const Donor = require("../models/Donor");

const token = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET);

// USER REGISTER
router.post("/register/user", async (req, res) => {
  try {
    const { name, email, password, city, location } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      city,
      location
    });

    res.json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// HOSPITAL REGISTER
router.post("/register/hospital", async (req, res) => {
  try {
    const { hospitalName, licenseNumber, email, password, city, location } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await Hospital.create({
      hospitalName,
      licenseNumber,
      email,
      password: hashed,
      city,
      location
    });

    res.json({ message: "Hospital pending approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});
//DONOR REGISTER
router.post("/register/donor", async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, location } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await Donor.create({
      name,
      email,
      password: hashed,
      bloodGroup,
      city,
      location
    });

    res.json({ message: "Donor registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Donor registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  let Model;
  if (role === "admin") Model = Admin;
  else if (role === "hospital") Model = Hospital;
  else if (role === "donor") Model = Donor;
  else Model = User;

  const user = await Model.findOne({ email });
  if (!user) return res.status(400).json({ message: "Not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  if (role === "hospital" && user.status !== "approved")
    return res.status(403).json({ message: "Hospital not approved" });

  res.json({
    token: jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    )
  });
});

module.exports = router;
