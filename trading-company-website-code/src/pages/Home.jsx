import {
  CheckCircle2,
  ChevronRight,
  IndianRupee,
  PackageCheck,
  ShieldCheck,
  Store,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { categories } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

const reasons = [
  { icon: PackageCheck, title: 'Bulk supply', text: 'Regular stock support for retailers, supermarkets, and wholesalers.' },
  { icon: ShieldCheck, title: 'Quality products', text: 'Selected edible oils and pulses packed for dependable resale.' },
  { icon: Truck, title: 'Timely delivery', text: 'Planned dispatches that keep local shelves and counters stocked.' },
  { icon: IndianRupee, title: 'Best wholesale pricing', text: 'Competitive bulk rates for growing grocery businesses.' },
  { icon: Store, title: 'Trusted by local retailers', text: 'A practical trading partner for shop owners and local buyers.' }
];

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <p className="eyebrow">Bulk food trading and local distribution</p>
            <h1 style={{ marginBottom: '12px' }}>Jayalakshmi Trading Company</h1>
            <div style={{ display: 'inline-block', background: 'var(--yellow-100)', padding: '6px 14px', borderRadius: '20px', color: 'var(--green-900)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '22px' }}>
              Estd. 2003 • 20+ Years of Excellence
            </div>
            <p className="hero-tagline">
              Quality edible oils and dal products supplied to retail stores,
              grocery shops, supermarkets, and wholesale buyers.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" to="/order">
                Place Order <ChevronRight size={18} />
              </Link>
              <Link className="btn secondary" to="/products">
                View Products
              </Link>
            </div>
          </div>
          <div className="hero-image-wrap reveal delay-1">
            <img
              src="/assets/hero-food-trading.png"
              alt="Bulk edible oil bottles and dal products arranged for food trading"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-section">
          <div>
            <p className="eyebrow">What we do</p>
            <h2>Reliable import and supply for daily grocery essentials.</h2>
          </div>
          <p>
            We import edible oil and pulses in bulk and distribute them to local
            retail shops, grocery businesses, supermarkets, and wholesalers. Our
            focus is simple: steady product availability, clean packing,
            practical pricing, and responsive service for shop owners.
          </p>
        </div>
      </section>

    <section className="section soft-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Featured Products</p>
          <h2>Quality bulk stock for your retail store</h2>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '38px' }}>
          <Link className="btn primary" to="/products">
            View All Products
          </Link>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Product categories</p>
          <h2>Essential stock for food retail businesses</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-tile" to="/products" key={category}>
              <CheckCircle2 size={20} />
              <span>{category}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="section soft-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Why choose us</p>
          <h2>A supply partner built around retail needs</h2>
        </div>
        <div className="reason-grid">
          {reasons.map(({ icon: Icon, title, text }) => (
            <article className="reason-item" key={title}>
              <div className="icon-box">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

      <section className="cta-band">
        <div className="container cta-content">
          <div>
            <p className="eyebrow">For shop owners</p>
            <h2>Are you a retail shop owner? Contact us for supply.</h2>
          </div>
          <Link className="btn primary light" to="/order">
            Place Order <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
