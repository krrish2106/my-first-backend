const cron = require('node-cron')
const User = require('../models/User')

const startCronJobs = () => {

  // Job 1 — runs every minute (for testing)
  cron.schedule('* * * * *', () => {
    console.log('Cron job running — every minute:', new Date().toLocaleTimeString())
  })

  // Job 2 — runs every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily cleanup...')
    // Example: delete unverified accounts older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const result = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: sevenDaysAgo }
    })
    console.log(`Cleaned up ${result.deletedCount} unverified accounts`)
  })

  // Job 3 — runs every Monday at 9am
  cron.schedule('0 9 * * 1', () => {
    console.log('Sending weekly newsletter...')
    // Send emails to all users
  })

  console.log('All cron jobs started!')
}

module.exports = startCronJobs