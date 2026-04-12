const mysql = require('mysql2/promise');
async function run() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'ENGali1234!@#$',
      database: 'goclick_db'
    });
    const [rows] = await pool.query('SELECT slug, youtubeId, youtubePlaylistUrl FROM products WHERE slug = "golab"');
    console.log(JSON.stringify(rows[0], null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
