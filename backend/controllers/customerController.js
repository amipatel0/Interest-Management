const Customer = require('../models/Customer');
const Interest = require('../models/Interest');
const Payment = require('../models/Payment');
const moment = require('moment');

exports.createCustomer = async (req, res) => {
    try {
        // Frontend sends snake_case
        const { name, phone, address, amount, interest_rate: interestRate, start_date: startDate, end_date: endDate, payment_method: paymentMethod, photo } = req.body;
        
        const start = moment(startDate);
        const end = moment(endDate);
        const duration = end.diff(start, 'months');
        const finalDuration = duration <= 0 ? 1 : duration;
        
        const customer = await Customer.create({
            name, 
            phone, 
            address, 
            amount, 
            interestRate, 
            startDate, 
            endDate, 
            duration: finalDuration, 
            paymentMethod: paymentMethod || 'Cash', 
            status: 'pending',
            photo: photo || null
        });

        // Interest Calculation
        const monthlyInterest = (parseFloat(amount) * parseFloat(interestRate)) / 100;
        const yearlyInterest = monthlyInterest * 12;
        const totalInterest = monthlyInterest * finalDuration;
        const totalAmount = parseFloat(amount) + totalInterest;

        await Interest.create({
            customerId: customer._id,
            monthlyInterest,
            yearlyInterest,
            totalAmount
        });

        // toJSON transform will convert _id to id
        res.status(201).json({ id: customer._id, message: 'Customer created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating customer', error: err.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        // toJSON is called automatically when passing to res.json
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        
        const calculation = await Interest.findOne({ customerId: customer._id });
        const payments = await Payment.find({ customerId: customer._id }).sort({ paymentDate: -1 });
        
        const responseData = {
            ...customer.toJSON(),
            calculation: calculation ? calculation.toJSON() : null,
            payments: payments.map(p => p.toJSON())
        };

        res.json(responseData);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customer', error: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const { name, phone, address, amount, interest_rate: interestRate, start_date: startDate, end_date: endDate, payment_method: paymentMethod, photo, status } = req.body;

        if (name !== undefined) customer.name = name;
        if (phone !== undefined) customer.phone = phone;
        if (address !== undefined) customer.address = address;
        if (paymentMethod !== undefined) customer.paymentMethod = paymentMethod;
        if (status !== undefined) customer.status = status;
        if (photo !== undefined) customer.photo = photo;

        let recalcInterest = false;

        if (amount !== undefined) { customer.amount = amount; recalcInterest = true; }
        if (interestRate !== undefined) { customer.interestRate = interestRate; recalcInterest = true; }
        if (startDate !== undefined) { customer.startDate = startDate; recalcInterest = true; }
        if (endDate !== undefined) { customer.endDate = endDate; recalcInterest = true; }

        if (recalcInterest) {
            const start = moment(customer.startDate);
            const end = moment(customer.endDate);
            const duration = end.diff(start, 'months');
            const finalDuration = duration <= 0 ? 1 : duration;
            customer.duration = finalDuration;

            const monthlyInterest = (parseFloat(customer.amount) * parseFloat(customer.interestRate)) / 100;
            const yearlyInterest = monthlyInterest * 12;
            const totalInterest = monthlyInterest * finalDuration;
            const totalAmount = parseFloat(customer.amount) + totalInterest;

            await Interest.findOneAndUpdate(
                { customerId: customer._id },
                { $set: { monthlyInterest, yearlyInterest, totalAmount } },
                { new: true, upsert: true }
            );
        }

        await customer.save();
        res.json({ message: 'Customer updated successfully' });
    } catch (err) {
        console.error("Update Customer Error:", err);
        res.status(500).json({ message: 'Error updating customer', error: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        await Interest.deleteMany({ customerId: req.params.id });
        await Payment.deleteMany({ customerId: req.params.id });
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting customer', error: err.message });
    }
};
