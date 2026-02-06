const jwt = require("jsonwebtoken");

const protect = (roles = []) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ NORMALIZE USER OBJECT
    req.user = {
      id: decoded.id,
      _id: decoded.id,          // 🔥 THIS FIXES EVERYTHING
      role: decoded.role
    };

    // ✅ ROLE CHECK
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
