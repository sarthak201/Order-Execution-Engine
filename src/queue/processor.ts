import { DexRouter } from "../router/DexRouter";
import { updateOrder } from "../db/pg";
import { publish } from "../ws/hub";

export async function processJob(data: any) {
  const { id, amount } = data;
  const router = new DexRouter();

  await publish(id, { orderId: id, status: "routing" });
  const best = await router.route();

  await updateOrder(id, { status: "building", chosen_dex: best.dex });
  await publish(id, { orderId: id, status: "building", meta: best });

  const exec = await router.executeSwap(best.dex, amount);
  await updateOrder(id, {
    status: "confirmed",
    tx_hash: exec.txHash,
    executed_price: exec.executedPrice,
  });
  await publish(id, { orderId: id, status: "confirmed", meta: exec });
  
  return { status: "confirmed", orderId: id, ...exec };
}
