const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/customer/:id/pdf', reportController.generateCustomerPDF);

module.exports = router;
