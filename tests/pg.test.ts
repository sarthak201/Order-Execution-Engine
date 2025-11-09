import { pool } from "../src/db/pg";

describe("Database", () => {
  it("should connect to Postgres", async () => {
    const res = await pool.query("SELECT 1");
    expect(res.rowCount).toBe(1);
  });
});

