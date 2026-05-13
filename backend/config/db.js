const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Create default admin if not exists
        const adminExists = await Admin.findOne({ username: 'parth' });

        if (!adminExists) {
            const hashedPwd = await bcrypt.hash('260793', 10);

            await Admin.create({
                username: 'parth',
                password: hashedPwd
            });

            console.log('Default admin created successfully.');
        }

    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;