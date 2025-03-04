const express = require('express')
const { createUpdateProfile, getProfile } = require('../controllers/profileController')
const { protectRoute } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/',protectRoute, createUpdateProfile)
router.get('/',protectRoute, getProfile)

module.exports = router;