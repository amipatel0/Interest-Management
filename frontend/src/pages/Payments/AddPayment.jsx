import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import api from '../../api/axios';

const AddPayment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        customer_id: id,
        paid_amount: '',
        payment_date: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payments', formData);
            navigate(`/customers/${id}`);
        } catch (err) {
            console.error("Error adding payment", err);
            alert("Failed to add payment.");
        }
    };

    return (
        <Container>
            <Button variant="link" className="text-light mb-3 text-decoration-none" onClick={() => navigate(`/customers/${id}`)}>
                <ArrowLeft /> Back to Customer
            </Button>
            <Row className="justify-content-center">
                <Col md={6}>
                    <div className="glass-card">
                        <h3 className="mb-4">Record Payment</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Paid Amount (₹)</Form.Label>
                                <Form.Control type="number" step="0.01" name="paid_amount" value={formData.paid_amount} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Payment Date</Form.Label>
                                <Form.Control type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} required />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Submit Payment
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AddPayment;
