import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Order from './pages/Order.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import AdminOrders from './pages/Admin/Orders.jsx';
import AdminProducts from './pages/Admin/Products.jsx';
import AdminMessages from './pages/Admin/Messages.jsx';
import ClientDashboard from './pages/Client/Dashboard.jsx';

function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/order" element={<Order />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminMessages />
            </ProtectedRoute>
          } />

          {/* Client Protected Routes */}
          <Route path="/client/*" element={
            <ProtectedRoute requiredRole="Client">
              <ClientDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
