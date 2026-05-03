const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', paymentController.addPayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
