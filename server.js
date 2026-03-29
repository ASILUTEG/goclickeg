import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ENGali1234!@#$',
  database: 'goclick_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const JWT_SECRET = 'super-secret-goclick-key';

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safe migration: add created_at if it doesn't exist yet
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
      console.log('Migration: added created_at column to users table');
    } catch (e) {
      // Column already exists — ignore duplicate column error
      if (e.code !== 'ER_DUP_FIELDNAME') console.error('Migration error:', e.message);
    }

    // Create custom_services table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL DEFAULT 'website',
        name_ar VARCHAR(255),
        name_en VARCHAR(255),
        tagline_ar TEXT,
        tagline_en TEXT,
        description_ar TEXT,
        description_en TEXT,
        price_ar VARCHAR(255),
        price_en VARCHAR(255),
        features_ar JSON,
        features_en JSON,
        tech_stack_ar JSON,
        tech_stack_en JSON,
        mainImage LONGTEXT,
        sort_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('custom_services table ready');

    const [rows] = await pool.query('SELECT * FROM users');
    if (rows.length === 0) {
      const hashed = await bcrypt.hash('admin123', 10);
      await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashed, 'admin']);
      console.log('Seeded default admin user');
    }
  } catch(e) { console.error('DB Init Error', e); }
}
initDb();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.put('/api/auth/settings', authenticateToken, async (req, res) => {
  const { newUsername, newPassword } = req.body;
  try {
    const userId = req.user.id;
    let query = 'UPDATE users SET ';
    const params = [];
    if (newUsername) {
      query += 'username = ?';
      params.push(newUsername);
    }
    if (newPassword) {
      const hashed = await bcrypt.hash(newPassword, 10);
      if (newUsername) query += ', ';
      query += 'password = ?';
      params.push(hashed);
    }
    query += ' WHERE id = ?';
    params.push(userId);
    
    if (params.length > 1) { // 1 param means only id
      await pool.query(query, params);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// ──────────────── User Management (admin-only) ────────────────

// GET all users
app.get('/api/users', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role, created_at FROM users ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST create user
app.post('/api/users', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { username, password, role = 'admin' } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashed, role]);
    res.status(201).json({ id: result.insertId, username, role });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Username already exists' });
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT update user
app.put('/api/users/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    const parts = [];
    const params = [];
    if (username) { parts.push('username = ?'); params.push(username); }
    if (password) { const h = await bcrypt.hash(password, 10); parts.push('password = ?'); params.push(h); }
    if (role)     { parts.push('role = ?'); params.push(role); }
    if (parts.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    params.push(id);
    await pool.query(`UPDATE users SET ${parts.join(', ')} WHERE id = ?`, params);
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Username already exists' });
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
app.delete('/api/users/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { id } = req.params;
  if (String(id) === String(req.user.id)) return res.status(400).json({ error: 'Cannot delete your own account' });
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET all products — ordered by sort_order ASC
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY sort_order ASC, id ASC');
    const products = [];

    for (const p of rows) {
      const [features]   = await pool.query('SELECT * FROM product_features WHERE product_id = ?', [p.id]);
      const [howItWorks] = await pool.query('SELECT * FROM product_how_it_works WHERE product_id = ?', [p.id]);
      const [partners]   = await pool.query('SELECT * FROM product_partners WHERE product_id = ?', [p.id]);
      const [success]    = await pool.query('SELECT * FROM product_success WHERE product_id = ?', [p.id]);
      const [images]     = await pool.query('SELECT * FROM product_images WHERE product_id = ?', [p.id]);
      const [faqs]       = await pool.query('SELECT * FROM product_faqs WHERE product_id = ?', [p.id]);

      products.push({
        id: p.id,
        sort_order: p.sort_order ?? 0,
        slug: p.slug,
        type: p.type,
        accentClassName: p.accentClassName,
        name: { ar: p.name_ar, en: p.name_en },
        tagline: { ar: p.tagline_ar, en: p.tagline_en },
        description: { ar: p.description_ar, en: p.description_en },
        price: { ar: p.price_ar, en: p.price_en },
        youtubeId: p.youtubeId || '',
        youtubePlaylistUrl: p.youtubePlaylistUrl || '',
        trialUrl: p.trialUrl || '',
        whatsappNumber: p.whatsappNumber || '',
        whatsappMessage: { ar: p.whatsappMessage_ar || '', en: p.whatsappMessage_en || '' },
        facebookUrl: p.facebookUrl || '',
        mainImage: p.mainImage || '',
        pricingImage: p.pricingImage_src ? { src: p.pricingImage_src, alt: { ar: p.pricingImage_alt_ar, en: p.pricingImage_alt_en } } : null,
        features:   features.map(f   => ({ ar: f.ar, en: f.en })),
        howItWorks: howItWorks.map(hw => ({ title: { ar: hw.title_ar, en: hw.title_en }, desc: { ar: hw.desc_ar, en: hw.desc_en } })),
        partners:   partners.map(pt  => ({ title: { ar: pt.title_ar, en: pt.title_en }, subtitle: { ar: pt.subtitle_ar, en: pt.subtitle_en }, imageSrc: pt.imageSrc })),
        success:    success.map(s    => ({ name: { ar: s.name_ar, en: s.name_en }, title: { ar: s.title_ar || '', en: s.title_en || '' }, quote: { ar: s.quote_ar, en: s.quote_en } })),
        images:     images.map(img   => ({ src: img.src, title: { ar: img.title_ar, en: img.title_en }, subtitle: { ar: img.subtitle_ar, en: img.subtitle_en } })),
        faqs:       faqs.map(fq      => ({ q: { ar: fq.q_ar, en: fq.q_en }, a: { ar: fq.a_ar, en: fq.a_en } }))
      });
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// PATCH reorder — accepts [{slug, sort_order}, ...] and bulk-updates
app.patch('/api/products/reorder', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { items } = req.body; // [{slug, sort_order}]
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
  try {
    for (const { slug, sort_order } of items) {
      await pool.query('UPDATE products SET sort_order = ? WHERE slug = ?', [sort_order, slug]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder products' });
  }
});

// GET single product by slug — always returns fresh data from DB
app.get('/api/products/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const [[p]] = await pool.query('SELECT * FROM products WHERE slug = ?', [slug]);
    if (!p) return res.status(404).json({ error: 'Product not found' });

    const [features]   = await pool.query('SELECT * FROM product_features WHERE product_id = ?', [p.id]);
    const [howItWorks] = await pool.query('SELECT * FROM product_how_it_works WHERE product_id = ?', [p.id]);
    const [partners]   = await pool.query('SELECT * FROM product_partners WHERE product_id = ?', [p.id]);
    const [success]    = await pool.query('SELECT * FROM product_success WHERE product_id = ?', [p.id]);
    const [images]     = await pool.query('SELECT * FROM product_images WHERE product_id = ?', [p.id]);
    const [faqs]       = await pool.query('SELECT * FROM product_faqs WHERE product_id = ?', [p.id]);

    res.json({
      id: p.id,
      sort_order: p.sort_order ?? 0,
      slug: p.slug,
      type: p.type,
      accentClassName: p.accentClassName,
      name: { ar: p.name_ar, en: p.name_en },
      tagline: { ar: p.tagline_ar, en: p.tagline_en },
      description: { ar: p.description_ar, en: p.description_en },
      price: { ar: p.price_ar, en: p.price_en },
      youtubeId: p.youtubeId || '',
      youtubePlaylistUrl: p.youtubePlaylistUrl || '',
      trialUrl: p.trialUrl || '',
      whatsappNumber: p.whatsappNumber || '',
      whatsappMessage: { ar: p.whatsappMessage_ar || '', en: p.whatsappMessage_en || '' },
      facebookUrl: p.facebookUrl || '',
      mainImage: p.mainImage || '',
      pricingImage: p.pricingImage_src ? { src: p.pricingImage_src, alt: { ar: p.pricingImage_alt_ar, en: p.pricingImage_alt_en } } : null,
      features:   features.map(f   => ({ ar: f.ar, en: f.en })),
      howItWorks: howItWorks.map(hw => ({ title: { ar: hw.title_ar, en: hw.title_en }, desc: { ar: hw.desc_ar, en: hw.desc_en } })),
      partners:   partners.map(pt  => ({ title: { ar: pt.title_ar, en: pt.title_en }, subtitle: { ar: pt.subtitle_ar, en: pt.subtitle_en }, imageSrc: pt.imageSrc })),
      success:    success.map(s    => ({ name: { ar: s.name_ar, en: s.name_en }, title: { ar: s.title_ar || '', en: s.title_en || '' }, quote: { ar: s.quote_ar, en: s.quote_en } })),
      images:     images.map(img   => ({ src: img.src, title: { ar: img.title_ar, en: img.title_en }, subtitle: { ar: img.subtitle_ar, en: img.subtitle_en } })),
      faqs:       faqs.map(fq      => ({ q: { ar: fq.q_ar, en: fq.q_en }, a: { ar: fq.a_ar, en: fq.a_en } }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Helper for inserting
async function insertProductData(connection, p) {
  const [result] = await connection.query(`
    INSERT INTO products
    (slug, type, accentClassName, name_ar, name_en, tagline_ar, tagline_en, description_ar, description_en,
     price_ar, price_en, youtubeId, youtubePlaylistUrl, trialUrl, whatsappNumber,
     whatsappMessage_ar, whatsappMessage_en, facebookUrl, mainImage,
     pricingImage_src, pricingImage_alt_ar, pricingImage_alt_en, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    p.slug, p.type, p.accentClassName, p.name.ar, p.name.en, p.tagline.ar, p.tagline.en,
    p.description.ar, p.description.en, p.price.ar, p.price.en,
    p.youtubeId || null, p.youtubePlaylistUrl || null, p.trialUrl || null,
    p.whatsappNumber || null, p.whatsappMessage?.ar || null, p.whatsappMessage?.en || null,
    p.facebookUrl || null, p.mainImage || null,
    p.pricingImage?.src || null, p.pricingImage?.alt?.ar || null, p.pricingImage?.alt?.en || null,
    p.sort_order ?? 0
  ]);

  const productId = result.insertId;

  if (p.features) {
    for (const f of p.features) await connection.query('INSERT INTO product_features (product_id, ar, en) VALUES (?, ?, ?)', [productId, f.ar, f.en]);
  }
  if (p.howItWorks) {
    for (const hw of p.howItWorks) await connection.query('INSERT INTO product_how_it_works (product_id, title_ar, title_en, desc_ar, desc_en) VALUES (?, ?, ?, ?, ?)', [productId, hw.title?.ar, hw.title?.en, hw.desc?.ar, hw.desc?.en]);
  }
  if (p.partners) {
    for (const pt of p.partners) await connection.query('INSERT INTO product_partners (product_id, title_ar, title_en, subtitle_ar, subtitle_en, imageSrc) VALUES (?, ?, ?, ?, ?, ?)', [productId, pt.title?.ar, pt.title?.en, pt.subtitle?.ar, pt.subtitle?.en, pt.imageSrc]);
  }
  if (p.success) {
    for (const s of p.success) await connection.query('INSERT INTO product_success (product_id, name_ar, name_en, title_ar, title_en, quote_ar, quote_en) VALUES (?, ?, ?, ?, ?, ?, ?)', [productId, s.name?.ar, s.name?.en, s.title?.ar, s.title?.en, s.quote?.ar, s.quote?.en]);
  }
  if (p.images) {
    for (const img of p.images) await connection.query('INSERT INTO product_images (product_id, src, title_ar, title_en, subtitle_ar, subtitle_en) VALUES (?, ?, ?, ?, ?, ?)', [productId, img.src, img.title?.ar, img.title?.en, img.subtitle?.ar, img.subtitle?.en]);
  }
  if (p.faqs) {
    for (const fq of p.faqs) await connection.query('INSERT INTO product_faqs (product_id, q_ar, q_en, a_ar, a_en) VALUES (?, ?, ?, ?, ?)', [productId, fq.q?.ar, fq.q?.en, fq.a?.ar, fq.a?.en]);
  }
}

// POST new product
app.post('/api/products', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const p = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await insertProductData(connection, p);
    await connection.commit();
    res.json({ success: true, product: p });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  } finally {
    connection.release();
  }
});

// PUT update product — uses UPDATE on main row, then refreshes child tables
app.put('/api/products/:slug', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const p = req.body;
  const slug = req.params.slug;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Verify product exists and get its stable ID
    const [rows] = await connection.query('SELECT id FROM products WHERE slug = ?', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const productId = rows[0].id;

    // 2. UPDATE the main products row in-place (preserves ID and created_at)
    await connection.query(`
      UPDATE products SET
        slug = ?, type = ?, accentClassName = ?,
        name_ar = ?, name_en = ?,
        tagline_ar = ?, tagline_en = ?,
        description_ar = ?, description_en = ?,
        price_ar = ?, price_en = ?,
        youtubeId = ?, youtubePlaylistUrl = ?,
        trialUrl = ?, whatsappNumber = ?,
        whatsappMessage_ar = ?, whatsappMessage_en = ?,
        facebookUrl = ?, mainImage = ?,
        pricingImage_src = ?, pricingImage_alt_ar = ?, pricingImage_alt_en = ?,
        sort_order = ?
      WHERE id = ?
    `, [
      p.slug, p.type, p.accentClassName,
      p.name?.ar, p.name?.en,
      p.tagline?.ar, p.tagline?.en,
      p.description?.ar, p.description?.en,
      p.price?.ar, p.price?.en,
      p.youtubeId || null, p.youtubePlaylistUrl || null,
      p.trialUrl || null, p.whatsappNumber || null,
      p.whatsappMessage?.ar || null, p.whatsappMessage?.en || null,
      p.facebookUrl || null, p.mainImage || null,
      p.pricingImage?.src || null, p.pricingImage?.alt?.ar || null, p.pricingImage?.alt?.en || null,
      p.sort_order ?? 0,
      productId
    ]);

    // 3. Refresh child tables (delete old rows, re-insert updated ones)
    await connection.query('DELETE FROM product_features WHERE product_id = ?', [productId]);
    await connection.query('DELETE FROM product_how_it_works WHERE product_id = ?', [productId]);
    await connection.query('DELETE FROM product_partners WHERE product_id = ?', [productId]);
    await connection.query('DELETE FROM product_success WHERE product_id = ?', [productId]);
    await connection.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
    await connection.query('DELETE FROM product_faqs WHERE product_id = ?', [productId]);

    if (p.features) {
      for (const f of p.features)
        await connection.query('INSERT INTO product_features (product_id, ar, en) VALUES (?, ?, ?)', [productId, f.ar, f.en]);
    }
    if (p.howItWorks) {
      for (const hw of p.howItWorks)
        await connection.query('INSERT INTO product_how_it_works (product_id, title_ar, title_en, desc_ar, desc_en) VALUES (?, ?, ?, ?, ?)', [productId, hw.title?.ar, hw.title?.en, hw.desc?.ar, hw.desc?.en]);
    }
    if (p.partners) {
      for (const pt of p.partners)
        await connection.query('INSERT INTO product_partners (product_id, title_ar, title_en, subtitle_ar, subtitle_en, imageSrc) VALUES (?, ?, ?, ?, ?, ?)', [productId, pt.title?.ar, pt.title?.en, pt.subtitle?.ar, pt.subtitle?.en, pt.imageSrc]);
    }
    if (p.success) {
      for (const s of p.success)
        await connection.query('INSERT INTO product_success (product_id, name_ar, name_en, title_ar, title_en, quote_ar, quote_en) VALUES (?, ?, ?, ?, ?, ?, ?)', [productId, s.name?.ar, s.name?.en, s.title?.ar, s.title?.en, s.quote?.ar, s.quote?.en]);
    }
    if (p.images) {
      for (const img of p.images)
        await connection.query('INSERT INTO product_images (product_id, src, title_ar, title_en, subtitle_ar, subtitle_en) VALUES (?, ?, ?, ?, ?, ?)', [productId, img.src, img.title?.ar, img.title?.en, img.subtitle?.ar, img.subtitle?.en]);
    }
    if (p.faqs) {
      for (const fq of p.faqs)
        await connection.query('INSERT INTO product_faqs (product_id, q_ar, q_en, a_ar, a_en) VALUES (?, ?, ?, ?, ?)', [productId, fq.q?.ar, fq.q?.en, fq.a?.ar, fq.a?.en]);
    }

    await connection.commit();
    res.json({ success: true, product: p });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  } finally {
    connection.release();
  }
});

// DELETE product
app.delete('/api/products/:slug', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const slug = req.params.slug;
  try {
    await pool.query('DELETE FROM products WHERE slug = ?', [slug]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
});

// POST review
app.post('/api/products/:slug/reviews', async (req, res) => {
  const slug = req.params.slug;
  const review = req.body;
  
  try {
    const [rows] = await pool.query('SELECT id FROM products WHERE slug = ?', [slug]);
    if (rows.length > 0) {
      const productId = rows[0].id;
      await pool.query('INSERT INTO product_success (product_id, name_ar, name_en, title_ar, title_en, quote_ar, quote_en) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [productId, review.name, review.name, review.title || null, review.title || null, review.quote, review.quote]);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
});

// ──────────── Custom Services API ────────────
function parseService(s) {
  const parse = (v) => { try { return typeof v === 'string' ? JSON.parse(v) : (v || []); } catch { return []; } };
  return {
    id: s.id, type: s.type, sort_order: s.sort_order ?? 0, is_active: !!s.is_active,
    name: { ar: s.name_ar, en: s.name_en },
    tagline: { ar: s.tagline_ar || '', en: s.tagline_en || '' },
    description: { ar: s.description_ar || '', en: s.description_en || '' },
    price: { ar: s.price_ar || '', en: s.price_en || '' },
    features: { ar: parse(s.features_ar), en: parse(s.features_en) },
    techStack: { ar: parse(s.tech_stack_ar), en: parse(s.tech_stack_en) },
    mainImage: s.mainImage || '',
  };
}

app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM custom_services ORDER BY sort_order ASC, id ASC');
    res.json(rows.map(parseService));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch services' }); }
});

app.post('/api/services', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const s = req.body;
  try {
    const [r] = await pool.query(`
      INSERT INTO custom_services
        (type, name_ar, name_en, tagline_ar, tagline_en, description_ar, description_en,
         price_ar, price_en, features_ar, features_en, tech_stack_ar, tech_stack_en, mainImage, sort_order, is_active)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [
      s.type, s.name?.ar, s.name?.en, s.tagline?.ar, s.tagline?.en,
      s.description?.ar, s.description?.en, s.price?.ar, s.price?.en,
      JSON.stringify(s.features?.ar || []), JSON.stringify(s.features?.en || []),
      JSON.stringify(s.techStack?.ar || []), JSON.stringify(s.techStack?.en || []),
      s.mainImage || null, s.sort_order ?? 0, s.is_active !== false ? 1 : 0
    ]);
    res.status(201).json({ success: true, id: r.insertId });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to create service' }); }
});

app.put('/api/services/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const s = req.body;
  const { id } = req.params;
  try {
    await pool.query(`
      UPDATE custom_services SET
        type=?, name_ar=?, name_en=?, tagline_ar=?, tagline_en=?,
        description_ar=?, description_en=?, price_ar=?, price_en=?,
        features_ar=?, features_en=?, tech_stack_ar=?, tech_stack_en=?,
        mainImage=?, sort_order=?, is_active=?
      WHERE id=?
    `, [
      s.type, s.name?.ar, s.name?.en, s.tagline?.ar, s.tagline?.en,
      s.description?.ar, s.description?.en, s.price?.ar, s.price?.en,
      JSON.stringify(s.features?.ar || []), JSON.stringify(s.features?.en || []),
      JSON.stringify(s.techStack?.ar || []), JSON.stringify(s.techStack?.en || []),
      s.mainImage || null, s.sort_order ?? 0, s.is_active !== false ? 1 : 0, id
    ]);
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update service' }); }
});

app.delete('/api/services/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM custom_services WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to delete service' }); }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('API Server running on http://localhost:' + PORT);
});
