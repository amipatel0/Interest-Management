import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import api from '../api/axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Clear session when browser/app fully closes
    useEffect(() => {

        const clearSession = () => {
            sessionStorage.removeItem('token');
        };

        window.addEventListener('beforeunload', clearSession);

        return () => {
            window.removeEventListener('beforeunload', clearSession);
        };

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await api.post('/auth/login', {
                username,
                password
            });

            sessionStorage.setItem('token', res.data.token);

            navigate('/');

        } catch (err) {

            setError(
                err.response?.data?.message || 'Login failed'
            );

        }
    };

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: '100vh' }}
        >
            <Row className="w-100 justify-content-center">

                <Col md={6} lg={4}>

                    <div className="glass-card text-center">

                        <h2 className="mb-4">
                            Admin Portal
                        </h2>

                        {error && (
                            <Alert variant="danger">
                                {error}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>

                            <Form.Group className="mb-3">

                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />

                            </Form.Group>

                            <Form.Group className="mb-4">

                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                            >
                                Login
                            </Button>

                        </Form>

                    </div>

                </Col>

            </Row>
        </Container>
    );
};

export default Login;