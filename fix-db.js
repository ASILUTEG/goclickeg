import mysql from 'mysql2/promise';

async function fix() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'ENGali1234!@#$',
      database: 'goclick_db'
    });

    await pool.query('ALTER TABLE products MODIFY trialUrl LONGTEXT');
    await pool.query('ALTER TABLE products MODIFY mainImage LONGTEXT');
    await pool.query('ALTER TABLE products MODIFY pricingImage_src LONGTEXT');
    await pool.query('ALTER TABLE product_partners MODIFY imageSrc LONGTEXT');
    await pool.query('ALTER TABLE product_images MODIFY src LONGTEXT');
    
    console.log('Fixed DB columns');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
