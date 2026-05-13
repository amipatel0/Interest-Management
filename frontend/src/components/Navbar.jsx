import { useState, useEffect } from 'react';
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BoxArrowRight, PeopleFill, Speedometer2, Calculator as CalcIcon, SunFill, MoonFill } from 'react-bootstrap-icons';
import Calculator from './Calculator';

const Navbar = () => {
    const navigate = useNavigate();
    const [showCalc, setShowCalc] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <BsNavbar expand="lg" className="custom-navbar mb-4" variant={theme === 'dark' ? 'dark' : 'light'}>
                <Container>
                    <BsNavbar.Brand as={Link} to="/">Interest Admin</BsNavbar.Brand>
                    <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
                    <BsNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/"><Speedometer2 className="me-1" /> Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/customers"><PeopleFill className="me-1" /> Customers</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link onClick={toggleTheme} className="d-flex align-items-center me-2">
                                {theme === 'dark' ? <SunFill className="me-1 text-warning" /> : <MoonFill className="me-1 text-primary" />} 
                                <span className="d-lg-none ms-1">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                            </Nav.Link>
                            <Nav.Link onClick={() => setShowCalc(!showCalc)}><CalcIcon className="me-1" /> Calculator</Nav.Link>
                            <Nav.Link onClick={handleLogout}><BoxArrowRight className="me-1" /> Logout</Nav.Link>
                        </Nav>
                    </BsNavbar.Collapse>
                </Container>
            </BsNavbar>
            {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
        </>
    );
};

export default Navbar;
