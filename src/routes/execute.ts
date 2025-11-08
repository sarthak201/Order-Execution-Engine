import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { enqueue } from '../queue/index.js';
import { insertOrder } from '../db/pg.js';
import { publish } from '../ws/hub.js';
import { randomUUID } from 'crypto';

export default async function route(app: FastifyInstance) {
  app.post('/api/orders/execute', async (req, reply) => {
    const schema = z.object({
      orderType: z.literal('market'),
      tokenIn: z.string(),
      tokenOut: z.string(),
      amount: z.number().positive()
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error);

    const id = randomUUID();
    const { orderType, tokenIn, tokenOut, amount } = parsed.data;

    await insertOrder({ id, status: 'pending', order_type: orderType, token_in: tokenIn, token_out: tokenOut, amount });
    await enqueue({ id, tokenIn, tokenOut, amount });
    await publish(id, { orderId: id, status: 'pending' });

    return { orderId: id };
  });
}
