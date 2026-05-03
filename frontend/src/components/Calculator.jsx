import { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

const Calculator = ({ onClose }) => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handleNumber = (num) => {
        setDisplay(display === '0' ? num : display + num);
    };

    const handleOperator = (op) => {
        setEquation(display + ' ' + op + ' ');
        setDisplay('0');
    };

    const calculate = () => {
        try {
            const result = eval(equation + display);
            setDisplay(String(result));
            setEquation('');
        } catch (e) {
            setDisplay('Error');
        }
    };

    const clear = () => {
        setDisplay('0');
        setEquation('');
    };

    return (
        <Card className="glass-card position-fixed shadow-lg" style={{ bottom: '20px', right: '20px', width: '250px', zIndex: 1050 }}>
            <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-0 pb-0">
                <strong style={{ color: 'var(--text-main)' }}>Calculator</strong>
                <Button variant="link" className="p-0" style={{ color: 'var(--text-main)' }} onClick={onClose}><X size={24} /></Button>
            </Card.Header>
            <Card.Body>
                <div className="p-2 mb-3 rounded text-end" style={{ minHeight: '60px', overflow: 'hidden', background: 'var(--input-bg)', color: 'var(--text-main)' }}>
                    <div className="text-muted small">{equation}</div>
                    <div className="fs-4">{display}</div>
                </div>
                <Row className="g-2 mb-2">
                    <Col xs={3}><Button variant="secondary" className="w-100" onClick={clear}>C</Button></Col>
                    <Col xs={3}><Button variant="secondary" className="w-100" onClick={() => handleOperator('/')}>&divide;</Button></Col>
                    <Col xs={3}><Button variant="secondary" className="w-100" onClick={() => handleOperator('*')}>&times;</Button></Col>
                    <Col xs={3}><Button variant="secondary" className="w-100" onClick={() => handleOperator('-')}>&minus;</Button></Col>
                </Row>
                <Row className="g-2 mb-2">
                    <Col xs={3}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('7')}>7</Button></Col>
                    <Col xs={3}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('8')}>8</Button></Col>
                    <Col xs={3}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('9')}>9</Button></Col>
                    <Col xs={3}><Button variant="secondary" className="w-100" onClick={() => handleOperator('+')}>+</Button></Col>
                </Row>
                <Row className="g-2 mb-2">
                    <Col xs={3}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('4')}>4</Button></Col>
                    <Col xs={3}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('5')}>5</Button></Col>
                    <Col xs={3}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('6')}>6</Button></Col>
                    <Col xs={3} rowSpan={2}><Button variant="primary" className="w-100 h-100" onClick={calculate}>=</Button></Col>
                </Row>
                <Row className="g-2">
                    <Col xs={6}>
                        <Row className="g-2 mb-2">
                            <Col xs={6}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('1')}>1</Button></Col>
                            <Col xs={6}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('2')}>2</Button></Col>
                        </Row>
                        <Row className="g-2">
                            <Col xs={12}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('0')}>0</Button></Col>
                        </Row>
                    </Col>
                    <Col xs={3}>
                        <Row className="g-2 mb-2">
                            <Col xs={12}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('3')}>3</Button></Col>
                        </Row>
                        <Row className="g-2">
                            <Col xs={12}><Button variant="outline-light" className="w-100" onClick={() => handleNumber('.')}>.</Button></Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default Calculator;
