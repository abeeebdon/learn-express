const secret_key = process.env.SECRET_KEY || "default_secret_key"; // Use a default secret key if not set
import jwt from "jsonwebtoken";
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secret_key, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
// Export the authenticateJWT middleware
export { authenticateJWT };
