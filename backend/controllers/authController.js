const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Login Admin
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check username
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Create JWT Token
        const payload = {
            id: admin._id,
            username: admin.username
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: admin._id,
                username: admin.username
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get Logged In Admin
exports.getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');

        if (!admin) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(admin);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: 'Server error'
        });
    }
};