import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CashStack, PeopleFill, WalletFill } from 'react-bootstrap-icons';
import api from '../api/axios';

const Dashboard = () => {
    const [summary, setSummary] = useState({});
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const summaryRes = await api.get('/dashboard/summary');
                setSummary(summaryRes.data);
                
                const remindersRes = await api.get('/dashboard/reminders');
                setReminders(remindersRes.data);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <Container>
            <h2 className="mb-4">Dashboard Overview</h2>
            <Row className="mb-4 g-4">
                <Col md={4}>
                    <div className="glass-card text-center">
                        <PeopleFill size={40} className="mb-2 text-primary" />
                        <h4>Total Customers</h4>
                        <h2>{summary.total_customers || 0}</h2>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="glass-card text-center">
                        <WalletFill size={40} className="mb-2 text-warning" />
                        <h4>Total Amount Given</h4>
                        <h2>₹{parseFloat(summary.total_given_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="glass-card text-center">
                        <CashStack size={40} className="mb-2 text-success" />
                        <h4>Total Interest Expected</h4>
                        <h2>₹{parseFloat(summary.total_interest_expected || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>
                </Col>
            </Row>

            <h3 className="mb-3">Payment Reminders</h3>
            <div className="glass-card p-0 overflow-hidden">
                <div className="table-responsive">
                    <Table hover className="mb-0">
                        <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <tr>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Due Date</th>
                                <th>Amount Due</th>
                                <th>Status/Flag</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reminders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No pending reminders</td>
                                </tr>
                            ) : (
                                reminders.map((rem, idx) => (
                                    <tr key={idx}>
                                        <td>{rem.name}</td>
                                        <td>{rem.phone}</td>
                                        <td>{new Date(rem.due_date).toLocaleDateString()}</td>
                                        <td className="text-danger fw-bold">₹{parseFloat(rem.due_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>
                                            <Badge bg={rem.type.includes('Overdue') ? 'danger' : 'warning'}>
                                                {rem.type}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Link to={`/customers/${rem.customer_id}`} className="btn btn-sm btn-primary">View</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container>
    );
};

export default Dashboard;
