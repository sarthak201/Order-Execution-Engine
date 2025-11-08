import IORedis from 'ioredis';
import type { FastifyInstance } from 'fastify';

const pub = new IORedis(process.env.REDIS_URL!);
const sub = new IORedis(process.env.REDIS_URL!);

export async function publish(orderId: string, event: any) {
  await pub.publish(`order:${orderId}`, JSON.stringify(event));
}

export function registerWs(app: FastifyInstance) {
  app.get('/api/orders/execute', { websocket: true }, async (conn, req) => {
    const url = new URL(req.url ?? '', 'http://x');
    const orderId = url.searchParams.get('orderId');
    if (!orderId) return conn.socket.close();
    await sub.subscribe(`order:${orderId}`);
    sub.on('message', (chan, msg) => {
      if (chan === `order:${orderId}`) conn.socket.send(msg);
    });
  });
}
