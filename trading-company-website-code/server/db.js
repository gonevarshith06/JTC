import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

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

export const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          mobile_number TEXT UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'Client',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          action TEXT NOT NULL,
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          type TEXT NOT NULL,
          accent TEXT,
          packageText TEXT,
          description TEXT,
          image TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ownerName TEXT NOT NULL,
          shopName TEXT NOT NULL,
          mobile TEXT NOT NULL,
          email TEXT NOT NULL,
          address TEXT NOT NULL,
          product TEXT NOT NULL,
          quantity TEXT NOT NULL,
          message TEXT,
          status TEXT DEFAULT 'Pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          mobile TEXT NOT NULL,
          email TEXT,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'Unread',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create default admin
      db.get('SELECT * FROM users WHERE role = ?', ['Admin'], async (err, row) => {
        if (!row) {
          const hashedPassword = await bcrypt.hash('Admin@123', 10);
          db.run(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin', 'admin@company.com', hashedPassword, 'Admin']
          );
        }

        // Seed products if empty
        db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
          if (row && row.count === 0) {
            const stmt = db.prepare('INSERT INTO products (id, name, category, type, accent, packageText, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            initialProducts.forEach(p => {
              stmt.run(p.id, p.name, p.category, p.type, p.accent, p.packageText, p.description, p.image);
            });
            stmt.finalize();
          }
          resolve();
        });
      });
    });
  });
};

export const logActivity = (userId, action, details = '') => {
    db.run('INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)', [userId, action, details]);
}

export default db;
