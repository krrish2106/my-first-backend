const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('User Routes', () => {

  // Test 1 — Get all users
  test('should get all users', async () => {
    const res = await request(app)
      .get('/users')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  // Test 2 — Get user with invalid ID
  test('should return 500 for invalid user id', async () => {
    const res = await request(app)
      .get('/users/invalidid')
    expect(res.statusCode).toBe(500)
  })

})