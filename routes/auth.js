const express = require('express')
const router = express.Router()
const { signup, login } = require('../controllers/authController')
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts.' }
})

router.post('/signup', signup)
router.post('/login', authLimiter, login)

module.exports = router