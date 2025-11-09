import { pool } from "../src/db/pg";

describe("Database Schema", () => {
  it("should have 'orders' table", async () => {
    const res = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_name='orders'"
    );
    expect(res.rows.length).toBe(1);
  });
});
