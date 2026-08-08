const express = require('express')
const router = express.Router()

router.post('/payment', (req, res) => {
  const event = req.body

  console.log('Webhook received:', event)

  if (event.type === 'payment.success') {
    console.log(`Payment of ₹${event.amount} received from ${event.email}`)
    // Update user's subscription in database
    // Send confirmation email
    // Generate invoice
  }

  if (event.type === 'payment.failed') {
    console.log(`Payment failed for ${event.email}`)
    // Send failure notification
    // Retry payment
  }

  res.status(200).json({ received: true })
})

module.exports = router