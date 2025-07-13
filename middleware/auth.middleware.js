import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware: Verify JWT token
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Authorization token missing" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // attach user object to request
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Optional: Role-based middleware (if needed in future)
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};
