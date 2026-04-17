const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'ypamdr17',
  database: 'sistem_monitoring_evaluasi_program',
});

(async () => {
  try {
    await client.connect();
    const res1 = await client.query('SELECT id_sekolah,nama_sekolah,email_login FROM m_sekolah ORDER BY id_sekolah DESC LIMIT 20');
    const res2 = await client.query('SELECT id_user,nama,email,id_role,id_sekolah,jenis FROM m_users ORDER BY id_user DESC LIMIT 20');
    console.log('SEKOLAH:', JSON.stringify(res1.rows, null, 2));
    console.log('USERS:', JSON.stringify(res2.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
})();
