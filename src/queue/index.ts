// src/queue/index.ts
import { Queue, Worker, type ConnectionOptions } from "bullmq";
import dotenv from "dotenv";
import { processJob } from "./processor.js";

dotenv.config();

// ✅ Define BullMQ-compliant connection options
const connection: ConnectionOptions = {
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null, // REQUIRED by BullMQ
  enableReadyCheck: false,
};

// ✅ Create BullMQ Queue
export const ordersQueue = new Queue("orders", { connection });

// ✅ Create BullMQ Worker
export const worker = new Worker(
  "orders",
  async (job) => {
    await processJob(job.data);
  },
  { connection }
);

// ✅ Helper to add jobs to the queue
export async function enqueue(data: Record<string, any>): Promise<string | undefined> {
  const job = await ordersQueue.add("execute", data);
  return job.id;
}
