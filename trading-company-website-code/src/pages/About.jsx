import { Leaf, ShieldCheck, Truck, Warehouse } from 'lucide-react';

const highlights = [
  { icon: Warehouse, title: 'Bulk importing', text: 'We source edible oil and pulses in volumes suitable for trade supply.' },
  { icon: Leaf, title: 'Daily food essentials', text: 'Our product focus stays close to fast-moving grocery requirements.' },
  { icon: Truck, title: 'Local distribution', text: 'We support shops, supermarkets, and wholesalers with regular dispatches.' },
  { icon: ShieldCheck, title: 'Professional service', text: 'Simple communication, clear order handling, and dependable follow-up.' }
];

function About() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container">
          <p className="eyebrow">About us</p>
          <h1>Quality edible oil and pulses for local retail supply.</h1>
          <p>
            Jayalakshmi Trading Company is a food trading company focused on
            importing quality edible oil and dal products in bulk and supplying
            them to retail shops, grocery stores, supermarkets, and wholesale
            businesses.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">Our business</p>
            <h2>Simple, reliable, and built for shop owners.</h2>
            <p>
              We work with food essentials that move every day in local markets.
              Our company imports edible oils and dal products in bulk, checks
              supply requirements, and makes products available for businesses
              that need steady stock at practical wholesale pricing.
            </p>
            <p>
              Our customers include small grocery shops, neighborhood retailers,
              supermarkets, and wholesale buyers. We keep our process
              professional and straightforward so buyers can request products,
              quantities, and delivery details without delay.
            </p>
          </div>
          <div className="mission-panel">
            <h3>Our promise</h3>
            <p>
              To supply dependable edible oil and pulses with clear communication,
              fair pricing, and timely delivery support for local food retail
              businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <div className="about-highlights">
            {highlights.map(({ icon: Icon, title, text }) => (
              <article className="highlight" key={title}>
                <Icon size={26} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
