// authMiddleware.js
const jwt = require('jsonwebtoken');

async function generateToken(user) {
  const payload = {
    userId: user.id,
  };

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'your-default-secret', options);
}

async function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { generateToken, authenticateToken };
