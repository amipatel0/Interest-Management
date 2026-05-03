const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash' },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    photo: { type: String, default: null }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            
            // Map camelCase to snake_case for frontend
            if (ret.interestRate !== undefined) { ret.interest_rate = ret.interestRate; delete ret.interestRate; }
            if (ret.startDate !== undefined) { ret.start_date = ret.startDate; delete ret.startDate; }
            if (ret.endDate !== undefined) { ret.end_date = ret.endDate; delete ret.endDate; }
            if (ret.paymentMethod !== undefined) { ret.payment_method = ret.paymentMethod; delete ret.paymentMethod; }
            
            return ret;
        }
    }
});

module.exports = mongoose.model('Customer', customerSchema);
