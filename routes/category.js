const express = require('express')
const { protectRoute } = require('../middlewares/authMiddleware')
const { getAllCategories, addCategory } = require('../controllers/category')
const router = express.Router()

router.post('/',protectRoute, addCategory)
router.get('/',protectRoute, getAllCategories)

module.exports = router;