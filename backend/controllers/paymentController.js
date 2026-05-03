const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Interest = require('../models/Interest');

exports.addPayment = async (req, res) => {
    try {
        // Frontend sends snake_case
        const { customer_id: customerId, paid_amount: paidAmount, payment_date: paymentDate } = req.body;
        
        const calculation = await Interest.findOne({ customerId });
        if (!calculation) {
            return res.status(404).json({ message: 'Customer calculation not found' });
        }
        const totalAmount = calculation.totalAmount;

        const payments = await Payment.find({ customerId });
        const previousPaid = payments.reduce((acc, curr) => acc + curr.paidAmount, 0);

        const newTotalPaid = parseFloat(previousPaid) + parseFloat(paidAmount);
        const remainingAmount = parseFloat(totalAmount) - newTotalPaid;

        const payment = await Payment.create({
            customerId,
            paidAmount,
            remainingAmount,
            paymentDate
        });

        let newStatus = 'pending';
        if (remainingAmount <= 0) {
            newStatus = 'paid';
        }
        await Customer.findByIdAndUpdate(customerId, { status: newStatus });

        res.status(201).json({ id: payment._id, message: 'Payment recorded successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding payment', error: err.message });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        const customerId = payment.customerId;
        await Payment.findByIdAndDelete(req.params.id);
        
        await Customer.findByIdAndUpdate(customerId, { status: 'pending' });

        res.json({ message: 'Payment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting payment', error: err.message });
    }
};
