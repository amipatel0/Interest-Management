import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/Customers/CustomerList';
import CustomerDetail from './pages/Customers/CustomerDetail';
import AddCustomer from './pages/Customers/AddCustomer';
import EditCustomer from './pages/Customers/EditCustomer';
import AddPayment from './pages/Payments/AddPayment';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Navbar /><CustomerList /></ProtectedRoute>} />
        <Route path="/customers/add" element={<ProtectedRoute><Navbar /><AddCustomer /></ProtectedRoute>} />
        <Route path="/customers/:id" element={<ProtectedRoute><Navbar /><CustomerDetail /></ProtectedRoute>} />
        <Route path="/customers/:id/edit" element={<ProtectedRoute><Navbar /><EditCustomer /></ProtectedRoute>} />
        <Route path="/customers/:id/payment" element={<ProtectedRoute><Navbar /><AddPayment /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
