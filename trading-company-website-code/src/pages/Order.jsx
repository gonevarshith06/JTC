import { Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const initialForm = {
  ownerName: '',
  shopName: '',
  mobile: '',
  email: '',
  address: '',
  product: '',
  quantity: '',
  message: ''
};

const requiredFields = {
  ownerName: 'Shop Owner Name is required.',
  shopName: 'Shop Name is required.',
  mobile: 'Mobile Number is required.',
  email: 'Email is required.',
  address: 'Location / Address is required.',
  product: 'Product Required is required.',
  quantity: 'Quantity Required is required.'
};

function Order() {
  const [searchParams] = useSearchParams();
  const requestedProduct = searchParams.get('product') || '';
  const [products, setProducts] = useState([]);
  const productNames = useMemo(() => products.map((product) => product.name), [products]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (requestedProduct && productNames.includes(requestedProduct)) {
      setForm((current) => ({ ...current, product: requestedProduct }));
    }
  }, [requestedProduct, productNames]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSuccess(false);
  };

  const validate = () => {
    const nextErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!form[field].trim()) {
        nextErrors[field] = message;
      }
    });

    const mobileDigits = form.mobile.replace(/\D/g, '');
    if (form.mobile && mobileDigits.length < 10) {
      nextErrors.mobile = 'Enter a valid mobile number with at least 10 digits.';
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        // Construct WhatsApp Message
        const messageBody = `*New Order Received!*
*Shop Name:* ${form.shopName}
*Owner Name:* ${form.ownerName}
*Mobile:* ${form.mobile}
*Email:* ${form.email}
*Address:* ${form.address}
*Product:* ${form.product}
*Quantity:* ${form.quantity}
*Additional Message:* ${form.message || 'None'}`;

        const whatsappUrl = `https://wa.me/919848359260?text=${encodeURIComponent(messageBody)}`;
        window.open(whatsappUrl, '_blank');

        setSuccess(true);
        setErrors({});
        setForm({ ...initialForm, product: requestedProduct && productNames.includes(requestedProduct) ? requestedProduct : '' });
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to submit order' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again later.' });
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Order form</p>
            <h1>Send us your product requirement.</h1>
          </div>
          <p>
            Share your shop details, product requirement, and approximate
            quantity. Our team will contact you with availability and pricing.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container form-layout">
          <div className="form-intro">
            <h2>Bulk supply order</h2>
            <p>
              Fill out the form below to request a bulk supply. Our team will contact you with availability and pricing.
            </p>
            <div className="mini-list">
              <span>Edible oil</span>
              <span>Dal and pulses</span>
              <span>Retail supply</span>
            </div>
          </div>

          <form className="business-form" onSubmit={handleSubmit} noValidate>
            {success && (
              <div className="success-message" role="status" data-saved-count={savedCount}>
                Thank you! Your order has been submitted. Our team will contact you soon.
              </div>
            )}

            <div className="form-grid">
              <label>
                Shop Owner Name
                <input
                  name="ownerName"
                  type="text"
                  value={form.ownerName}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.ownerName)}
                />
                {errors.ownerName && <small>{errors.ownerName}</small>}
              </label>

              <label>
                Shop Name
                <input
                  name="shopName"
                  type="text"
                  value={form.shopName}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.shopName)}
                />
                {errors.shopName && <small>{errors.shopName}</small>}
              </label>

              <label>
                Mobile Number
                <input
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.mobile)}
                />
                {errors.mobile && <small>{errors.mobile}</small>}
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <small>{errors.email}</small>}
              </label>

              <label className="full-span">
                Location / Address
                <input
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.address)}
                />
                {errors.address && <small>{errors.address}</small>}
              </label>

              <label>
                Product Required
                <select
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.product)}
                >
                  <option value="">Select product</option>
                  {productNames.map((name) => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.product && <small>{errors.product}</small>}
              </label>

              <label>
                Quantity Required
                <input
                  name="quantity"
                  type="text"
                  placeholder="Example: 50 bags or 100 cartons"
                  value={form.quantity}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.quantity)}
                />
                {errors.quantity && <small>{errors.quantity}</small>}
              </label>

              <label className="full-span">
                Message
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Mention delivery area, preferred packing, or any other requirement."
                />
              </label>
            </div>

            <button className="btn primary form-submit" type="submit">
              Submit Order <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Order;
