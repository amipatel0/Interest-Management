const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/interest_db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPwd = await bcrypt.hash('admin123', 10);
            await Admin.create({ username: 'admin', password: hashedPwd });
            console.log("Default admin created successfully.");
        }
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
