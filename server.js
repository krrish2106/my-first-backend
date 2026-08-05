require('dotenv').config()
const rateLimit = require('express-rate-limit')

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('Error connecting:', err))

const User = require('./models/User')
const helmet = require('helmet')
const express = require('express')
const app = express()
app.use(express.json())

app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests. Please try again after 15 minutes.'
  }
})

app.use(limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.'
  }
})

app.use('/auth/login', authLimiter)

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`)
  next()
})

const protectedRoutes = require('./routes/protected')
app.use('/api', protectedRoutes)

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

const checkAuth = (req, res, next) => {
  const password = req.headers['x-password']

  if (password !== 'krish123') {
    return res.status(401).json({ error: 'Unauthorised. Wrong password.' })
  }

  next()
}

app.get('/dashboard', checkAuth, (req, res) => {
  res.json({ message: 'Welcome to the dashboard! You are authorised.' })
})

const PORT = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World! My first backend is alive.')
})

app.get('/about', (req, res) => {
  res.send('This is my backend. Built by me from scratch.')
})

app.get('/user', (req, res) => {
  res.json({
    name: 'Krish',
    city: 'Delhi',
    learning: 'Backend development',
    day: 2
  })
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/users/:id', (req, res) => {
  const users = [
    { id: 1, name: 'Krish', city: 'Delhi' },
    { id: 2, name: 'Rahul', city: 'Mumbai' },
    { id: 3, name: 'Priya', city: 'Bangalore' }
  ]

  const id = parseInt(req.params.id)
  const user = users.find(u => u.id === id)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
})

app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body)
    await newUser.save()
    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const updatedData = req.body

  res.json({
    message: `User ${id} updated successfully`,
    updatedUser: updatedData
  })
})

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id)

  res.json({
    message: `User ${id} deleted successfully`
  })
})

app.get('/secret', (req, res) => {
  res.json({
    appName: process.env.APP_NAME,
    message: process.env.SECRET_MESSAGE
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})


