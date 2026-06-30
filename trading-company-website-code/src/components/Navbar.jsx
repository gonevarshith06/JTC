import { Menu, ShoppingBasket, X, User } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/products', label: 'Products' },
  { path: '/order', label: 'Order' },
  { path: '/contact', label: 'Contact Us' }
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="Jayalakshmi Trading Company home">
          <span className="brand-mark">
            <ShoppingBasket size={22} strokeWidth={2.4} />
          </span>
          <span>
            <strong>Jayalakshmi</strong>
            <small>Trading Company</small>
          </span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          ))}
          
          <div className="nav-divider"></div>
          
          {user ? (
            <>
              <NavLink
                to={user.role === 'Admin' ? '/admin' : '/client'}
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'active auth-link' : 'auth-link')}
              >
                <User size={18} style={{marginRight: '6px'}}/> Dashboard
              </NavLink>
              <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu} className="auth-link">Login</NavLink>
              <NavLink to="/register" onClick={closeMenu} className="auth-link nav-btn-primary">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
