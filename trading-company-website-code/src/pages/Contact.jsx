import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

const contactInitial = {
  name: '',
  mobile: '',
  email: '',
  message: ''
};

function Contact() {
  const [form, setForm] = useState(contactInitial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSent(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.mobile.trim()) nextErrors.mobile = 'Mobile number is required.';
    if (form.mobile && form.mobile.replace(/\D/g, '').length < 10) {
      nextErrors.mobile = 'Enter a valid mobile number.';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!form.message.trim()) nextErrors.message = 'Message is required.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSent(true);
    setErrors({});
    setForm(contactInitial);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Contact us</p>
            <h1>Talk to us about regular supply.</h1>
          </div>
          <p>
            Reach out for product availability, wholesale pricing, delivery
            areas, or partnership discussions.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-details">
            <h2>Contact details</h2>
            <div className="contact-row">
              <span>Company Name</span>
              <strong>Jayalakshmi Trading Company</strong>
            </div>
            <div className="contact-row">
              <span><Phone size={18} /> Phone Number</span>
              <strong>+91 93475 77313, +91 98483 59260</strong>
            </div>
            <div className="contact-row">
              <span><Mail size={18} /> Email</span>
              <strong>jayalakshmi02031976@gmail.com</strong>
            </div>
            <div className="contact-row">
              <span><MapPin size={18} /> Address</span>
              <strong>Plot No. 20, Nirmal Road, Bellary Nagar, Kurnool, Andhra Pradesh, India</strong>
            </div>
            <div className="contact-row">
              <span><Clock size={18} /> Business Hours</span>
              <strong>Monday to Saturday, 9:00 AM to 7:00 PM</strong>
            </div>
          </div>

          <form className="business-form" onSubmit={handleSubmit} noValidate>
            <h2>Send a message</h2>
            {sent && (
              <div className="success-message" role="status">
                Thank you! Your message has been received.
              </div>
            )}
            <label>
              Name
              <input name="name" type="text" value={form.name} onChange={handleChange} />
              {errors.name && <small>{errors.name}</small>}
            </label>
            <label>
              Mobile Number
              <input name="mobile" type="tel" value={form.mobile} onChange={handleChange} />
              {errors.mobile && <small>{errors.mobile}</small>}
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} />
              {errors.email && <small>{errors.email}</small>}
            </label>
            <label>
              Message
              <textarea name="message" rows="5" value={form.message} onChange={handleChange} />
              {errors.message && <small>{errors.message}</small>}
            </label>
            <button className="btn primary form-submit" type="submit">
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
