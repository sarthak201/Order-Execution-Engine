import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();

describe("BullMQ Queue", () => {
  const q = new Queue("orders", { connection });

  it("should add a job to the queue", async () => {
    const job = await q.add("execute-order", { tokenIn: "SOL" });
    expect(job.id).toBeDefined();
  });
});
