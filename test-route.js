import mysql from 'mysql2/promise';
import http from 'http';

const pool = mysql.createPool({
  host: 'localhost', user: 'root',
  password: 'ENGali1234!@#$', database: 'goclick_db'
});

// 1. Get slugs in DB
const [rows] = await pool.query('SELECT id, slug FROM products');
console.log('DB slugs:', rows);

// 2. Hit the API endpoint
const slug = rows[0]?.slug;
if (!slug) { console.log('No products in DB'); process.exit(0); }

console.log(`\nTesting GET /api/products/${slug} ...`);
const req = http.get(`http://localhost:3001/api/products/${slug}`, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(body);
      if (res.statusCode === 200) {
        console.log('✅ Success — keys:', Object.keys(parsed).join(', '));
      } else {
        console.log('❌ Error response:', parsed);
      }
    } catch(e) {
      console.log('Raw body:', body.slice(0, 300));
    }
    pool.end();
    process.exit(0);
  });
});
req.on('error', e => { console.error('Request error:', e.message); process.exit(1); });
