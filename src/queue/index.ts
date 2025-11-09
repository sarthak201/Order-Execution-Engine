import { Queue, Worker, type ConnectionOptions } from "bullmq";
import dotenv from "dotenv";
import { processJob } from "./processor";

dotenv.config();

const connection: ConnectionOptions = {
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const ordersQueue = new Queue("orders", { connection });

export const worker = new Worker(
  "orders",
  async (job) => {
    await processJob(job.data);
  },
  { connection }
);

export async function enqueue(data: Record<string, any>): Promise<string | undefined> {
  const job = await ordersQueue.add("execute", data);
  return job.id;
}
