const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Only accept static hardcoded credentials
        if (username !== 'parth' || password !== '260793') {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { id: 'static_admin_id', username: 'parth' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: 'static_admin_id', username: 'parth' } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        if (req.user && req.user.username === 'parth') {
            res.json({ id: 'static_admin_id', username: 'parth' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
