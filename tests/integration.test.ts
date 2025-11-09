import Fastify from "fastify";
import app from "../src/app";
import { pool } from "../src/db/pg";

describe("Integration - API to DB", () => {
  const server = Fastify();
  beforeAll(async () => {
    await server.register(app);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("should insert an order and appear in DB", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload: { orderType: "market", tokenIn: "SOL", tokenOut: "USDC", amount: 1 }
    });

    const body = JSON.parse(res.body);
    const db = await pool.query("SELECT * FROM orders WHERE id = $1", [body.orderId]);
    expect(db.rowCount).toBe(1);
  });
});
