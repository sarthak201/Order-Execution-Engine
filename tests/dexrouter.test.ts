import { DexRouter } from "../src/services/DexRouter";

describe("DexRouter", () => {
  it("should choose a valid DEX with realistic price", async () => {
    const router = new DexRouter();
    const result = await router.route("SOL", "USDC", 1);

    expect(["raydium", "meteora"]).toContain(result.dex);
    expect(result.price).toBeGreaterThan(0);
  });
});
