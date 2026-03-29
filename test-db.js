import mysql from 'mysql2/promise';

async function testConnection() {
  console.log('🔌 Testing MySQL connection...');
  console.log('   Host: localhost');
  console.log('   User: root');
  console.log('   DB:   goclick_db\n');

  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'ENGali1234!@#$',
      database: 'goclick_db',
      connectionLimit: 3,
    });

    // 1. Basic ping
    const [ping] = await pool.query('SELECT 1 AS connected');
    console.log('✅  Connection: SUCCESS');

    // 2. List tables
    const [tables] = await pool.query('SHOW TABLES');
    console.log(`\n📋  Tables in goclick_db (${tables.length} found):`);
    tables.forEach(t => console.log('    -', Object.values(t)[0]));

    // 3. Row counts per table
    console.log('\n📊  Row counts:');
    for (const t of tables) {
      const tName = Object.values(t)[0];
      const [[{ cnt }]] = await pool.query(`SELECT COUNT(*) AS cnt FROM \`${tName}\``);
      console.log(`    ${tName}: ${cnt} row(s)`);
    }

    // 4. User list (without passwords)
    const [users] = await pool.query('SELECT id, username, role FROM users');
    console.log('\n👤  Admin users:');
    users.forEach(u => console.log(`    [${u.id}] ${u.username} — role: ${u.role}`));

    await pool.end();
    console.log('\n🏁  Test complete. All good!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌  DB Connection FAILED!');
    console.error('    Error code   :', err.code);
    console.error('    Error message:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR')  console.error('    👉 Fix: Wrong username or password');
    if (err.code === 'ECONNREFUSED')             console.error('    👉 Fix: MySQL server is not running');
    if (err.code === 'ER_BAD_DB_ERROR')          console.error('    👉 Fix: Database "goclick_db" does not exist');
    process.exit(1);
  }
}

testConnection();
