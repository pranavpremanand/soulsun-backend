const express = require("express");
const { checkDBHealth, resetDB, seedDB } = require("../controllers/healthController");
const router = express.Router();

router.get('/', checkDBHealth)
router.get('/refresh', resetDB)
router.get('/seed', seedDB)

module.exports = router;