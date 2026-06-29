import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h2>Jayalakshmi Trading Company</h2>
          <p>
            Bulk edible oil and dal supply for local retail shops, grocery stores,
            supermarkets, and wholesale businesses.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link to="/products">Products</Link>
          <Link to="/order">Place Order</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div>
          <h3>Contact</h3>
          <p className="footer-contact">
            <Phone size={16} /> +91 93475 77313, +91 98483 59260
          </p>
          <p className="footer-contact">
            <Mail size={16} /> jayalakshmi02031976@gmail.com
          </p>
          <p className="footer-contact">
            <MapPin size={16} /> Plot No. 20, Nirmal Road, Bellary Nagar, Kurnool
          </p>
          <p className="footer-contact">
            <Clock size={16} /> Mon to Sat, 9:00 AM to 7:00 PM
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Jayalakshmi Trading Company. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
