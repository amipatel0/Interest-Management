import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FileEarmarkPdfFill, PlusCircleFill, ArrowLeft, PrinterFill, EyeFill } from 'react-bootstrap-icons';
import api from '../../api/axios';

const CustomerDetail = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await api.get(`/customers/${id}`);
                setCustomer(res.data);
            } catch (err) {
                console.error("Error fetching customer", err);
            }
        };
        fetchCustomer();
    }, [id]);

    const handleDownloadPDF = async () => {
        try {
            const res = await api.get(`/reports/customer/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${customer.name.replace(/\s+/g, '_')}_report.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("Error downloading PDF", err);
        }
    };

    const handlePreviewPrintPDF = async () => {
        try {
            const res = await api.get(`/reports/customer/${id}/pdf`, { responseType: 'blob' });
            const fileURL = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const win = window.open(fileURL, '_blank');
            if (win) win.focus();
        } catch (err) {
            console.error("Error opening PDF", err);
        }
    };

    const handleDeleteCustomer = async () => {
        if (window.confirm("Are you sure you want to completely delete this customer and all their payments? This cannot be undone.")) {
            try {
                await api.delete(`/customers/${id}`);
                navigate('/customers');
            } catch (err) {
                console.error("Error deleting customer", err);
                alert("Failed to delete customer.");
            }
        }
    };

    if (!customer) return <Container className="text-center mt-5">Loading...</Container>;

    const calc = customer.calculation || {};

    const getStatusColor = (status) => {
        if (status === 'paid') return 'success';
        if (status === 'pending') return 'warning';
        if (status === 'overdue') return 'danger';
        return 'secondary';
    };

    return (
        <Container>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
                <Button variant="link" className="text-light text-decoration-none p-0" onClick={() => navigate('/customers')}>
                    <ArrowLeft /> Back to Customers
                </Button>
                <div className="d-flex flex-column flex-sm-row gap-2 w-100" style={{ maxWidth: '400px' }}>
                    <Button variant="outline-primary" className="flex-grow-1" onClick={() => navigate(`/customers/${id}/edit`)}>
                        Edit Customer
                    </Button>
                    <Button variant="outline-danger" className="flex-grow-1" onClick={handleDeleteCustomer}>
                        Delete Customer
                    </Button>
                </div>
            </div>
            
            <Row className="mb-4">
                <Col md={12}>
                    <div className="glass-card mb-4 mb-md-0">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <div 
                                    className="rounded-circle overflow-hidden bg-dark d-flex align-items-center justify-content-center border border-secondary"
                                    style={{ width: '60px', height: '60px' }}
                                >
                                    {customer.photo ? (
                                        <img src={customer.photo} alt={customer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span className="text-muted small">No Photo</span>
                                    )}
                                </div>
                                <h3 className="mb-0">{customer.name}</h3>
                            </div>
                            <Badge bg={getStatusColor(customer.status)} className="fs-6">
                                {customer.status.toUpperCase()}
                            </Badge>
                        </div>
                        <Row className="mb-3">
                            <Col md={4} sm={6}>
                                <p className="text-muted mb-1">Phone</p>
                                <h6>{customer.phone}</h6>
                                <p className="text-muted mb-1 mt-3">Address</p>
                                <h6>{customer.address}</h6>
                            </Col>
                            <Col md={4} sm={6}>
                                <p className="text-muted mb-1">Start Date</p>
                                <h6>{new Date(customer.start_date).toLocaleDateString()}</h6>
                                <p className="text-muted mb-1 mt-3">End Date</p>
                                <h6>{new Date(customer.end_date).toLocaleDateString()}</h6>
                                <p className="text-muted mb-1 mt-3">Payment Method</p>
                                <h6>{customer.payment_method}</h6>
                            </Col>
                            <Col md={4} sm={12}>
                                <div className="p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                    <h5 className="text-warning mb-2">Loan Details</h5>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Principal:</span> <strong>₹{parseFloat(customer.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Interest Rate:</span> <strong>{customer.interest_rate}%</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Monthly Interest:</span> <strong>₹{parseFloat(calc.monthly_interest || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Yearly Interest:</span> <strong>₹{parseFloat(calc.yearly_interest || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="d-flex justify-content-between text-success">
                                        <span>Total Payable:</span> <strong>₹{parseFloat(calc.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }}/>
                        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-md-end">
                            <Button variant="outline-light" onClick={handlePreviewPrintPDF} className="flex-grow-1 flex-md-grow-0">
                                <EyeFill className="me-2" /> Preview / Print
                            </Button>
                            <Button variant="primary" onClick={handleDownloadPDF} className="flex-grow-1 flex-md-grow-0">
                                <FileEarmarkPdfFill className="me-2" /> Download PDF
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
                <h4 className="mb-0">Payment History</h4>
                <Link to={`/customers/${id}/payment`} className="btn btn-sm btn-primary w-100 w-sm-auto" style={{ maxWidth: '200px' }}>
                    <PlusCircleFill className="me-2" /> Add Payment
                </Link>
            </div>
            
            <div className="glass-card p-0 overflow-hidden">
                <div className="table-responsive">
                    <Table hover className="mb-0">
                        <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <tr>
                                <th>Date</th>
                                <th>Paid Amount</th>
                                <th>Remaining Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customer.payments && customer.payments.map(p => (
                                <tr key={p.id}>
                                    <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                                    <td className="text-success fw-bold">₹{parseFloat(p.paid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>₹{parseFloat(p.remaining_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                            {(!customer.payments || customer.payments.length === 0) && (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">No payments recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container>
    );
};

export default CustomerDetail;
