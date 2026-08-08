const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB!")
  } catch (err) {
    console.log("Error connecting:", err)
    process.exit(1)
  }
}

module.exports = connectDB
