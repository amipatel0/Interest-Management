const Customer = require('../models/Customer');
const Interest = require('../models/Interest');
const Payment = require('../models/Payment');
const moment = require('moment');

exports.getSummary = async (req, res) => {
    try {
        // Use MongoDB aggregation
        const totalCustomers = await Customer.countDocuments();
        
        const customerAgg = await Customer.aggregate([
            { $group: { _id: null, totalGiven: { $sum: "$amount" } } }
        ]);
        const totalGiven = customerAgg.length > 0 ? customerAgg[0].totalGiven : 0;
        
        const interestAgg = await Interest.aggregate([
            { $group: { _id: null, allExpected: { $sum: "$totalAmount" } } }
        ]);
        const allExpected = interestAgg.length > 0 ? interestAgg[0].allExpected : 0;

        const totalInterestExpected = allExpected - totalGiven;

        res.json({
            total_customers: totalCustomers,
            total_given_amount: totalGiven,
            total_interest_expected: totalInterestExpected > 0 ? totalInterestExpected : 0
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching summary', error: err.message });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const customers = await Customer.find({ status: { $ne: 'paid' } });
        
        const reminders = [];
        const today = moment().startOf('day');
        
        for (let customer of customers) {
            const endDate = moment(customer.endDate).startOf('day');
            const diffDays = endDate.diff(today, 'days');

            let reminderType = null;
            if (diffDays === 7) reminderType = '7 days before due';
            else if (diffDays === 2) reminderType = '2 days before due';
            else if (diffDays === 0) reminderType = 'Due today';
            else if (diffDays < 0) {
                reminderType = `Overdue by ${Math.abs(diffDays)} days`;
                if (customer.status !== 'overdue') {
                    await Customer.findByIdAndUpdate(customer._id, { status: 'overdue' });
                    customer.status = 'overdue';
                }
            }

            if (reminderType) {
                const calculation = await Interest.findOne({ customerId: customer._id });
                const payments = await Payment.find({ customerId: customer._id });
                
                const totalAmount = calculation ? calculation.totalAmount : 0;
                const totalPaid = payments.reduce((acc, curr) => acc + curr.paidAmount, 0);
                const dueAmount = totalAmount - totalPaid;

                reminders.push({
                    customer_id: customer._id, // frontend expects customer_id
                    name: customer.name,
                    phone: customer.phone,
                    due_date: customer.endDate,
                    due_amount: dueAmount,
                    type: reminderType,
                    status: customer.status
                });
            }
        }
        
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reminders', error: err.message });
    }
};
