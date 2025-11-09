import Fastify from "fastify";
import app from "../src/app";

describe("API - /api/orders/execute", () => {
  const server = Fastify();
  beforeAll(async () => {
    await server.register(app);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("should create a new order successfully", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload: { orderType: "market", tokenIn: "SOL", tokenOut: "USDC", amount: 1 }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.orderId).toBeDefined();
  });
});
