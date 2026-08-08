require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/database')

const app = express()

// Connect to database
connectDB()

const startCronJobs = require('./services/cronService')
startCronJobs()

// Middleware first — always before routes
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

// Routes — always after middleware
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})