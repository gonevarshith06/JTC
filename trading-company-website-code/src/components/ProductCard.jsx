import { Droplets, Package, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const Icon = product.type === 'oil' ? Droplets : Package;

  return (
    <article className="product-card">
      <div className="product-media" style={{ '--product-accent': product.accent }}>
        {product.image && (
          <img src={product.image} alt={product.name} className="product-image" />
        )}
        <div className="product-shape">
          <Icon size={42} />
        </div>
        <span>{product.category}</span>
      </div>
      <div className="product-body">
        <p className="eyebrow">{product.packageText}</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <Link className="text-button" to={`/order?product=${encodeURIComponent(product.name)}`}>
          Order <Send size={16} />
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
