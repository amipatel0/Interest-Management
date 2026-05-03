const axios = require('axios');

async function testUpdate() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', { username: 'admin', password: 'admin123' });
        const token = loginRes.data.token;
        console.log("Logged in");

        const getRes = await axios.get('http://localhost:5000/api/customers', { headers: { Authorization: `Bearer ${token}` } });
        const customers = getRes.data;
        if (customers.length === 0) {
            console.log("No customers found");
            return;
        }

        const id = customers[0].id;
        console.log(`Updating customer ${id}`);

        const updateData = {
            name: "Updated Name",
            phone: "1234567890",
            address: "123 Main St",
            amount: 1000,
            interest_rate: 2,
            start_date: "2023-01-01",
            end_date: "2023-12-31",
            payment_method: "Cash"
        };

        const putRes = await axios.put(`http://localhost:5000/api/customers/${id}`, updateData, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Update successful", putRes.data);
    } catch (err) {
        console.error("Error updating:", err.response ? err.response.data : err.message);
    }
}

testUpdate();
