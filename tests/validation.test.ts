import Fastify from "fastify";
import app from "../src/app";

describe("Validation", () => {
  const server = Fastify();
  beforeAll(async () => {
    await server.register(app);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("should reject invalid payload", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload: { tokenIn: "SOL" }
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
