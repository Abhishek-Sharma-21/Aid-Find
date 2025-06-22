import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

export const isSeeker = (req, res, next) => {
  if (req.user && req.user.role === "Seeker") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Seeker role required." });
  }
};

export const isDonor = (req, res, next) => {
  if (req.user && req.user.role === "Donor") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Donor role required." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin role required." });
  }
}; 