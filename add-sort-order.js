import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost', user: 'root',
  password: 'ENGali1234!@#$', database: 'goclick_db'
});

try {
  await pool.query('ALTER TABLE products ADD COLUMN sort_order INT DEFAULT 0');
  console.log('✅ Added sort_order column');
} catch(e) {
  if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  sort_order column already exists');
  else throw e;
}

// Initialize values based on current DB order
const [rows] = await pool.query('SELECT id FROM products ORDER BY id ASC');
for (let i = 0; i < rows.length; i++) {
  await pool.query('UPDATE products SET sort_order = ? WHERE id = ?', [i + 1, rows[i].id]);
}
console.log(`✅ Initialized sort_order for ${rows.length} products (1..${rows.length})`);

await pool.end();
process.exit(0);
