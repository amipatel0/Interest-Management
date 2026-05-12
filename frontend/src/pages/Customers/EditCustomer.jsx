import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import api from '../../api/axios';

const EditCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        amount: '',
        interest_rate: '1',
        start_date: '',
        end_date: '',
        duration: 0,
        payment_method: 'Cash',
        status: 'pending',
        photo: ''
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await api.get(`/customers/${id}`);
                const data = res.data;
                setFormData({
                    name: data.name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    amount: data.amount || '',
                    interest_rate: data.interest_rate || '1',
                    start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '',
                    end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '',
                    duration: data.duration || 0,
                    payment_method: data.payment_method || 'Cash',
                    status: data.status || 'pending',
                    photo: data.photo || ''
                });
                if (data.photo) setPreview(data.photo);
            } catch (err) {
                console.error("Error fetching customer", err);
            }
        };
        fetchCustomer();
    }, [id]);

    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            let months = (end.getFullYear() - start.getFullYear()) * 12;
            months -= start.getMonth();
            months += end.getMonth();
            setFormData(prev => ({ ...prev, duration: months <= 0 ? 1 : months }));
        }
    }, [formData.start_date, formData.end_date]);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 10);
        } else if (name === 'name') {
            value = value.replace(/[^a-zA-Z\s]/g, '');
        }
        setFormData({ ...formData, [name]: value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getExactDuration = (start_date, end_date) => {
        if (!start_date || !end_date) return '';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/customers/${id}`, formData);
            navigate(`/customers/${id}`);
        } catch (err) {
            console.error("Error updating customer", err);
            alert(`Failed to update customer: ${err.response?.data?.message || err.message}\n${err.response?.data?.error || ''}`);
        }
    };

    return (
        <Container>
            <Button variant="link" className="text-light mb-3 text-decoration-none" onClick={() => navigate(`/customers/${id}`)}>
                <ArrowLeft /> Back to Details
            </Button>
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="glass-card">
                        <h3 className="mb-4">Edit Customer</h3>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-4 align-items-center">
                                <Col md={3} className="text-center mb-3 mb-md-0">
                                    <div 
                                        className="rounded-circle overflow-hidden bg-dark d-flex align-items-center justify-content-center mx-auto border border-secondary"
                                        style={{ width: '100px', height: '100px' }}
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span className="text-muted small">No Photo</span>
                                        )}
                                    </div>
                                </Col>
                                <Col md={9}>
                                    <Form.Group>
                                        <Form.Label>Customer Photo</Form.Label>
                                        <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Customer Name</Form.Label>
                                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" name="phone" pattern="\d{10}" title="Please enter exactly 10 digits" maxLength="10" value={formData.phone} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control as="textarea" rows={2} name="address" value={formData.address} onChange={handleChange} />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Amount (₹)</Form.Label>
                                        <Form.Control type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Interest Rate (%)</Form.Label>
                                        <Form.Select name="interest_rate" value={formData.interest_rate} onChange={handleChange}>
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i+1} value={i+1}>{i+1}%</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Duration</Form.Label>
                                        <Form.Control type="text" value={getExactDuration(formData.start_date, formData.end_date)} disabled />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Payment Method</Form.Label>
                                        <Form.Control type="text" name="payment_method" value={formData.payment_method} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="overdue">Overdue</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="primary" type="submit" className="w-100">
                                Update Customer
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default EditCustomer;
