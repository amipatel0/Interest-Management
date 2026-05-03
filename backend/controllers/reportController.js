const PDFDocument = require('pdfkit');
const Customer = require('../models/Customer');
const Interest = require('../models/Interest');
const moment = require('moment');

exports.generateCustomerPDF = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findById(customerId);
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        const calculation = await Interest.findOne({ customerId: customerId }) || {};
        
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=customer_${customer._id}_report.pdf`);
        
        doc.pipe(res);

        // Header
        doc.fontSize(20).text('Interest Management System', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('Customer Loan Agreement', { align: 'center', underline: true });
        doc.moveDown(2);

        // Customer Details
        doc.fontSize(12);
        doc.text(`Customer Name: ${customer.name}`);
        doc.text(`Phone Number: ${customer.phone}`);
        doc.text(`Address: ${customer.address}`);
        doc.moveDown();
        
        doc.text(`Principal Amount: Rs. ${parseFloat(customer.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        doc.text(`Interest Rate: ${customer.interestRate}%`);
        doc.text(`Start Date: ${moment(customer.startDate).format('YYYY-MM-DD')}`);
        doc.text(`End Date: ${moment(customer.endDate).format('YYYY-MM-DD')}`);
        const getExactDuration = (start_date, end_date) => {
            if (!start_date || !end_date) return '0 days';
            const start = new Date(start_date);
            const end = new Date(end_date);
            if (start > end) return 'Invalid dates';

            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();

            if (days < 0) {
                months--;
                const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            let res = [];
            if (years > 0) res.push(`${years} year${years > 1 ? 's' : ''}`);
            if (months > 0) res.push(`${months} month${months > 1 ? 's' : ''}`);
            if (days > 0) res.push(`${days} day${days > 1 ? 's' : ''}`);
            
            return res.length > 0 ? res.join(' ') : '0 days';
        };

        doc.text(`Duration: ${getExactDuration(customer.startDate, customer.endDate)}`);
        doc.moveDown();

        doc.text(`Monthly Interest: Rs. ${parseFloat(calculation.monthlyInterest || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        doc.text(`Yearly Interest: Rs. ${parseFloat(calculation.yearlyInterest || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        doc.text(`Total Payable Amount: Rs. ${parseFloat(calculation.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, { stroke: true });
        doc.moveDown(4);

        // Signatures
        const startY = doc.y;
        
        doc.moveTo(50, startY).lineTo(200, startY).stroke();
        doc.text('Customer Signature', 50, startY + 10);

        doc.moveTo(350, startY).lineTo(500, startY).stroke();
        doc.text('Admin Signature', 350, startY + 10);

        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating PDF' });
    }
};
