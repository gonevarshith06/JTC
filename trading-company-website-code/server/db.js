import bcrypt from 'bcryptjs';
import fs from 'fs';

const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
const dbPath = isVercel ? '/tmp/db.json' : './db.json';

// Initial static products for seeding
const initialProducts = [
  { id: 'sunflower-oil', name: 'Sunflower Oil', category: 'Edible Oils', type: 'oil', accent: '#e8b423', packageText: 'Bulk tins, jars, and cartons', description: 'Refined sunflower oil suitable for grocery stores, supermarkets, and wholesale resale.', image: 'https://olivewellnessinstitute.org/wp-content/uploads/2024/02/shutterstock_150359531-scaled.jpg' },
  { id: 'groundnut-oil', name: 'Groundnut Oil', category: 'Edible Oils', type: 'oil', accent: '#c98b2f', packageText: 'Bulk cans and retail packs', description: 'Quality groundnut oil sourced for consistent taste, freshness, and dependable supply.', image: 'https://wordpresscmsprodstor.blob.core.windows.net/wp-cms/2021/12/19.webp' },
  { id: 'palm-oil', name: 'Palm Oil', category: 'Edible Oils', type: 'oil', accent: '#d76b2b', packageText: 'Wholesale drums and packs', description: 'Bulk palm oil options for retail distribution, food businesses, and wholesale buyers.', image: 'https://m.media-amazon.com/images/I/71cdiQR1+SL._AC_UF894,1000_QL80_.jpg' },
  { id: 'toor-dal', name: 'Toor Dal', category: 'Dal & Pulses', type: 'pulse', accent: '#f1c24c', packageText: '25 kg and 50 kg bags', description: 'Popular split pigeon pea dal supplied in bulk with reliable grading and clean packing.', image: 'https://ganeshagro.com/wp-content/uploads/2024/10/image-88.png' },
  { id: 'moong-dal', name: 'Moong Dal', category: 'Dal & Pulses', type: 'pulse', accent: '#74a957', packageText: '25 kg and 50 kg bags', description: 'Clean moong dal for retail stores and grocery businesses needing regular stock movement.', image: 'https://vibrantliving.in/cdn/shop/files/MoongDalSplitSkinless.jpg?v=1731059585&width=2048' },
  { id: 'chana-dal', name: 'Chana Dal', category: 'Dal & Pulses', type: 'pulse', accent: '#d5a33e', packageText: '25 kg and 50 kg bags', description: 'Wholesale chana dal with practical packaging for local retailers and distributors.', image: '' },
  { id: 'urad-dal', name: 'Urad Dal', category: 'Dal & Pulses', type: 'pulse', accent: '#5c513f', packageText: '25 kg and 50 kg bags', description: 'Reliable urad dal supply for grocery shops, supermarkets, and wholesale counters.', image: '' },
  { id: 'masoor-dal', name: 'Masoor Dal', category: 'Dal & Pulses', type: 'pulse', accent: '#d36f53', packageText: '25 kg and 50 kg bags', description: 'Bulk masoor dal selected for clean appearance, good quality, and timely availability.', image: '' }
];

let db = {
  users: [],
  sessions: [],
  activity_logs: [],
  products: [],
  orders: [],
  messages: []
};

export const saveDb = () => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error("Failed to save DB", e);
  }
};

export const initDb = async () => {
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
      console.error("Failed to read DB", e);
    }
  }
  
  if (!db.products || db.products.length === 0) {
    db.products = [...initialProducts];
  }
  if (!db.users) db.users = [];
  if (!db.orders) db.orders = [];
  if (!db.messages) db.messages = [];
  if (!db.sessions) db.sessions = [];
  if (!db.activity_logs) db.activity_logs = [];

  if (!db.users.find(u => u.role === 'Admin')) {
    db.users.push({
      id: 1,
      full_name: 'Admin',
      email: 'admin@company.com',
      mobile_number: '0000000000',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'Admin',
      created_at: new Date().toISOString()
    });
  }
  saveDb();
};

export const logActivity = (userId, action, details = '') => {
  db.activity_logs.push({
    id: Date.now(),
    user_id: userId,
    action,
    details,
    created_at: new Date().toISOString()
  });
  saveDb();
};

export default db;
