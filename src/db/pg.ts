import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function insertOrder(row: any) {
  await pool.query(
    `INSERT INTO orders (id, status, order_type, token_in, token_out, amount)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [row.id, row.status, row.order_type, row.token_in, row.token_out, row.amount]
  );
}

export async function updateOrder(id: string, fields: any) {
  const updates = Object.entries(fields).map(([k, v], i) => `${k}=$${i + 1}`).join(', ');
  const values = Object.values(fields);
  await pool.query(`UPDATE orders SET ${updates} WHERE id='${id}'`, values);
}
