const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    paidAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    paymentDate: { type: Date, required: true }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            
            if (ret.customerId !== undefined) { ret.customer_id = ret.customerId; delete ret.customerId; }
            if (ret.paidAmount !== undefined) { ret.paid_amount = ret.paidAmount; delete ret.paidAmount; }
            if (ret.remainingAmount !== undefined) { ret.remaining_amount = ret.remainingAmount; delete ret.remainingAmount; }
            if (ret.paymentDate !== undefined) { ret.payment_date = ret.paymentDate; delete ret.paymentDate; }
            
            return ret;
        }
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
