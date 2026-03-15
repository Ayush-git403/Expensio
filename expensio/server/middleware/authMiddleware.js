const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Read token from cookie instead of Authorization header
  const token = req.cookies.expensio_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
};

module.exports = protect;