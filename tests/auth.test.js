const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('Auth Routes', () => {

  // Test 1 — Signup with valid data
  test('should signup successfully with valid data', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@gmail.com`,
        password: 'test123'
      })
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toBe('Account created successfully')
  })

  // Test 2 — Signup with missing fields
  test('should fail signup with missing fields', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        name: 'Test User'
      })
    expect(res.statusCode).toBe(400)
  })

  // Test 3 — Signup with invalid email
  test('should fail signup with invalid email', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'notanemail',
        password: 'test123'
      })
    expect(res.statusCode).toBe(400)
  })

  // Test 4 — Login with wrong password
  // Test 4 — Login with wrong password
test('should fail login with wrong password', async () => {
  // First create a user
  const email = `logintest${Date.now()}@gmail.com`
  
  await request(app)
    .post('/auth/signup')
    .send({
      name: 'Login Test',
      email: email,
      password: 'correct123'
    })

  // Then try login with wrong password
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: email,
      password: 'wrongpassword'
    })
    
  expect(res.statusCode).toBe(400)
})

})