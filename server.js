require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/database')
const startCronJobs = require('./services/cronService')

connectDB()
startCronJobs()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})