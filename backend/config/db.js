import pkg from 'pg';
const { Pool } = pkg;  // standard way to import from 'pg'

export const sql = new Pool({
  user: 'postgres',              // your postgres username
  host: 'localhost',
  database: 'Salon',              // your database
  password: 'donald123',          // your password
  port: 5432,                     // Postgres default port
});

async function testConnection() {
  try {
    const res = await sql.query('SELECT NOW()');
    console.log(res.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
  }
}

testConnection();
