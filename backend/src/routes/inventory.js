const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getInventory, sellItem, withdrawItem } = require('../controllers/inventoryController');

router.get('/', auth, getInventory);
router.post('/sell', auth, sellItem);
router.post('/withdraw', auth, withdrawItem);

module.exports = router;
