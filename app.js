require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:3000', 'https://my-first-backend-production-ceb8.up.railway.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'authorization']
}))
app.use(express.json())
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests.' }
}))

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`)
  next()
})

// Routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const webhookRoutes = require('./routes/webhooks')

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/webhooks', webhookRoutes)

// Root
app.get('/', (req, res) => {
  res.json({ message: 'API is running!' })
})

module.exports = app