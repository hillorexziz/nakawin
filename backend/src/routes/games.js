const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getCases, openCase, spinWheel } = require('../controllers/gamesController');

router.get('/cases', auth, getCases);
router.post('/cases/open', auth, openCase);
router.post('/wheel/spin', auth, spinWheel);

module.exports = router;
