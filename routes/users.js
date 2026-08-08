const express = require('express')
const router = express.Router()
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController')
const verifyToken = require('../middleware/auth')

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.put('/:id', verifyToken, updateUser)
router.delete('/:id', verifyToken, deleteUser)

module.exports = router