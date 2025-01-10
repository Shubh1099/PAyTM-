const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  console.log("1. Middleware started");
  const authHeader = req.headers.authorization || req.headers.Authorization;

  console.log("2. Auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token = authHeader.split(" ")[1];
  console.log("3. Token:", token);
  console.log("4. JWT_SECRET:", JWT_SECRET);

  console.log("5. About to enter try block");
  try {
    console.log("6. Inside try block");
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("7. Token verified:", decoded);

    if (decoded.id) {
      req.userId = decoded.id;
      next();
    } else {
      return res.status(403).json({});
    }
  } catch (err) {
    console.error("Error in catch block:", err);
    return res.status(403).json({});
  }
};
module.exports = {
  authMiddleware,
};
