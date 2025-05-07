import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};