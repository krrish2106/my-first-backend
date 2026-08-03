const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Protected route
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    userId: req.user.userId
  })
})

module.exports = router