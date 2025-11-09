import { jest } from "@jest/globals";
import WebSocket from "ws";
import Fastify from "fastify";
import appPlugin from "../src/app";

jest.setTimeout(10000);

describe("WebSocket /ws/:orderId", () => {
  let server: any;
  let fastify: any;

  beforeAll(async () => {
    fastify = Fastify();
    await fastify.register(appPlugin);
    server = await fastify.listen({ port: 3001 });
  });

  afterAll(async () => {
    await fastify.close();
  });

  it("should connect and receive messages", (done) => {
    const orderId = "test-order";
    const ws = new WebSocket(`ws://localhost:3001/ws/${orderId}`);

    let messageCount = 0;

    ws.on("open", () => console.log("WebSocket connected"));

    ws.on("message", (msg) => {
      const data = JSON.parse(msg.toString());
      console.log(data);
      messageCount++;
      if (data.status === "confirmed") {
        ws.close();
      }
    });

    ws.on("close", () => {
      expect(messageCount).toBeGreaterThan(2);
      done();
    });
  });
});
