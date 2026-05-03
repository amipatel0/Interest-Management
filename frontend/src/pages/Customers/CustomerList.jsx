import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PlusCircleFill, EyeFill } from 'react-bootstrap-icons';
import api from '../../api/axios';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/customers');
                setCustomers(res.data);
            } catch (err) {
                console.error("Error fetching customers", err);
            }
        };
        fetchCustomers();
    }, []);

    const getStatusColor = (status) => {
        if (status === 'paid') return 'success';
        if (status === 'pending') return 'warning';
        if (status === 'overdue') return 'danger';
        return 'secondary';
    };

    return (
        <Container>
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2>Customers</h2>
                </Col>
                <Col className="text-end">
                    <Link to="/customers/add" className="btn btn-primary">
                        <PlusCircleFill className="me-2" /> Add Customer
                    </Link>
                </Col>
            </Row>

            <div className="glass-card p-0 overflow-hidden">
                <div className="table-responsive">
                    <Table hover className="mb-0">
                        <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <tr>
                                <th>Customer Name</th>
                                <th>Amount</th>
                                <th>Interest Rate</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c.id} className="align-middle">
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div 
                                                className="rounded-circle overflow-hidden bg-dark d-flex align-items-center justify-content-center border border-secondary"
                                                style={{ width: '32px', height: '32px', flexShrink: 0 }}
                                            >
                                                {c.photo ? (
                                                    <img src={c.photo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span className="text-muted" style={{ fontSize: '10px' }}>No Pic</span>
                                                )}
                                            </div>
                                            {c.name}
                                        </div>
                                    </td>
                                    <td>₹{parseFloat(c.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{c.interest_rate}%</td>
                                    <td>{new Date(c.end_date).toLocaleDateString()}</td>
                                    <td>
                                        <Badge bg={getStatusColor(c.status)}>
                                            {c.status.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Link to={`/customers/${c.id}`} className="btn btn-sm btn-outline-light">
                                            <EyeFill /> View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No customers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container>
    );
};

export default CustomerList;
