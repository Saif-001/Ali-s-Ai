import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  // Check if the request headers contain a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user ID to the request object
      req.user = { id: decoded.id };
      next(); // Move on to the next function
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};