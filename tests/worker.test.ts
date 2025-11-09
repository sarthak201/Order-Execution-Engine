import { processJob } from "../src/queue/processor";
import { randomUUID } from "crypto";

describe("Worker Processor", () => {
  it("should process job and return result", async () => {
    const id = randomUUID();
    const result = await processJob({ id, amount: 1 });
    expect(result.status).toBe("confirmed");
  });
});
