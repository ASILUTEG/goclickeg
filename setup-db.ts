import mysql from 'mysql2/promise';
import { products } from './src/content/products';

async function setup() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ENGali1234!@#$'
  });

  console.log('Connected to MySQL server.');

  await connection.query('CREATE DATABASE IF NOT EXISTS goclick_db');
  console.log('Database `goclick_db` created or already exists.');

  await connection.query('USE goclick_db');

  // Create products table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      type VARCHAR(50) NOT NULL,
      accentClassName VARCHAR(255),
      name_ar VARCHAR(255),
      name_en VARCHAR(255),
      tagline_ar TEXT,
      tagline_en TEXT,
      description_ar TEXT,
      description_en TEXT,
      price_ar VARCHAR(255),
      price_en VARCHAR(255),
      youtubeId VARCHAR(100),
      youtubePlaylistUrl VARCHAR(255),
      trialUrl VARCHAR(255),
      whatsappNumber VARCHAR(50),
      whatsappMessage_ar TEXT,
      whatsappMessage_en TEXT,
      facebookUrl VARCHAR(255),
      mainImage VARCHAR(255),
      pricingImage_src VARCHAR(255),
      pricingImage_alt_ar VARCHAR(255),
      pricingImage_alt_en VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Created `products` table.');

  // Create features table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS product_features (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      ar TEXT,
      en TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Create howItWorks table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS product_how_it_works (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      title_ar VARCHAR(255),
      title_en VARCHAR(255),
      desc_ar TEXT,
      desc_en TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Create partners table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS product_partners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      title_ar VARCHAR(255),
      title_en VARCHAR(255),
      subtitle_ar VARCHAR(255),
      subtitle_en VARCHAR(255),
      imageSrc VARCHAR(255),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Create success (reviews) table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS product_success (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      name_ar VARCHAR(255),
      name_en VARCHAR(255),
      title_ar VARCHAR(255),
      title_en VARCHAR(255),
      quote_ar TEXT,
      quote_en TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Create images table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      src VARCHAR(255),
      title_ar VARCHAR(255),
      title_en VARCHAR(255),
      subtitle_ar VARCHAR(255),
      subtitle_en VARCHAR(255),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Create faqs table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS product_faqs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      q_ar TEXT,
      q_en TEXT,
      a_ar TEXT,
      a_en TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  console.log('Created all related tables.');

  // Check if products exist before inserting to avoid duplicate key errors:
  const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
  if ((rows as any)[0].count > 0) {
    console.log('Database already populated. Exiting script. Run `TRUNCATE TABLE products` to reset if needed.');
  } else {
    for (const p of products) {
      const [result] = await connection.query(`
        INSERT INTO products 
        (slug, type, accentClassName, name_ar, name_en, tagline_ar, tagline_en, description_ar, description_en, price_ar, price_en, youtubeId, youtubePlaylistUrl, trialUrl, whatsappNumber, whatsappMessage_ar, whatsappMessage_en, facebookUrl, mainImage, pricingImage_src, pricingImage_alt_ar, pricingImage_alt_en)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.slug, p.type, p.accentClassName,
        p.name.ar, p.name.en, p.tagline.ar, p.tagline.en,
        p.description.ar, p.description.en, p.price.ar, p.price.en,
        p.youtubeId || null, p.youtubePlaylistUrl || null, p.trialUrl || null,
        p.whatsappNumber || null, p.whatsappMessage?.ar || null, p.whatsappMessage?.en || null,
        p.facebookUrl || null, p.mainImage || null,
        p.pricingImage?.src || null, p.pricingImage?.alt.ar || null, p.pricingImage?.alt.en || null
      ]);

      const productId = (result as any).insertId;

      if (p.features) {
        for (const f of p.features) {
          await connection.query('INSERT INTO product_features (product_id, ar, en) VALUES (?, ?, ?)', [productId, f.ar, f.en]);
        }
      }

      if (p.howItWorks) {
        for (const hw of p.howItWorks) {
          await connection.query('INSERT INTO product_how_it_works (product_id, title_ar, title_en, desc_ar, desc_en) VALUES (?, ?, ?, ?, ?)', [productId, hw.title.ar, hw.title.en, hw.desc.ar, hw.desc.en]);
        }
      }

      if (p.partners) {
        for (const pt of p.partners) {
          await connection.query('INSERT INTO product_partners (product_id, title_ar, title_en, subtitle_ar, subtitle_en, imageSrc) VALUES (?, ?, ?, ?, ?, ?)', [productId, pt.title.ar, pt.title.en, pt.subtitle.ar, pt.subtitle.en, pt.imageSrc]);
        }
      }

      if (p.success) {
        for (const s of p.success) {
          await connection.query('INSERT INTO product_success (product_id, name_ar, name_en, title_ar, title_en, quote_ar, quote_en) VALUES (?, ?, ?, ?, ?, ?, ?)', [productId, s.name.ar, s.name.en, s.title?.ar || null, s.title?.en || null, s.quote.ar, s.quote.en]);
        }
      }

      if (p.images) {
        for (const img of p.images) {
          await connection.query('INSERT INTO product_images (product_id, src, title_ar, title_en, subtitle_ar, subtitle_en) VALUES (?, ?, ?, ?, ?, ?)', [productId, img.src, img.title.ar, img.title.en, img.subtitle.ar, img.subtitle.en]);
        }
      }

      if (p.faqs) {
        for (const fq of p.faqs) {
          await connection.query('INSERT INTO product_faqs (product_id, q_ar, q_en, a_ar, a_en) VALUES (?, ?, ?, ?, ?)', [productId, fq.q.ar, fq.q.en, fq.a.ar, fq.a.en]);
        }
      }

      console.log(`Successfully migrated data for product: ${p.slug}`);
    }
    console.log('All local data successfully converted and migrated to MySQL!');
  }

  await connection.end();
  console.log('MySQL connection closed.');
}

setup().catch(console.error);
