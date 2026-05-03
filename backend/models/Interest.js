const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    monthlyInterest: { type: Number, required: true },
    yearlyInterest: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            
            if (ret.customerId !== undefined) { ret.customer_id = ret.customerId; delete ret.customerId; }
            if (ret.monthlyInterest !== undefined) { ret.monthly_interest = ret.monthlyInterest; delete ret.monthlyInterest; }
            if (ret.yearlyInterest !== undefined) { ret.yearly_interest = ret.yearlyInterest; delete ret.yearlyInterest; }
            if (ret.totalAmount !== undefined) { ret.total_amount = ret.totalAmount; delete ret.totalAmount; }
            
            return ret;
        }
    }
});

module.exports = mongoose.model('Interest', interestSchema);
