import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Products</p>
            <h1>Wholesale edible oils and dal products.</h1>
          </div>
          <p>
            Browse our regular product range and place an order for pricing,
            availability, quantity, and delivery support.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Products;
