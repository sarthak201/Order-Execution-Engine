import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';
dotenv.config();

import executeRoute from './routes/execute';
import { registerWs } from './ws/hub';
import './queue/index'; // initializes queue/worker

const app = Fastify({ logger: true });
await app.register(websocket);
await app.register(executeRoute);
registerWs(app);

const port = Number(process.env.PORT ?? 3000);
app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
