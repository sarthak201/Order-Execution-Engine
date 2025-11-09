import Fastify from "fastify";
import app from "../src/app";

describe("Load Test", () => {
  const server = Fastify();
  beforeAll(async () => {
    await server.register(app);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("should handle 10 orders concurrently", async () => {
    const promises = Array.from({ length: 10 }).map(() =>
      server.inject({
        method: "POST",
        url: "/api/orders/execute",
        payload: { orderType: "market", tokenIn: "SOL", tokenOut: "USDC", amount: 1 }
      })
    );
    const responses = await Promise.all(promises);
    responses.forEach((r) => expect(r.statusCode).toBe(200));
  });
});
