import Fastify, { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import formbody from "@fastify/formbody";
import multipart from "@fastify/multipart";

dotenv.config();

import executeRoute from "./routes/execute.js";
import { registerWs } from "./ws/hub.js";

export default async function appPlugin(app: FastifyInstance) {
  app.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
    try {
      const json = JSON.parse(body.toString());
      done(null, json);
    } catch (err) {
      done(err as Error, undefined);
    }
  });

  await app.register(formbody);
  await app.register(multipart);

  await app.register(executeRoute);
  await registerWs(app);
}

if (process.env.NODE_ENV !== "test") {
  const app = Fastify({ 
    logger: true,
    bodyLimit: 1048576,
  });
  
  await app.register(appPlugin);
  
  await import("./queue/index.js");
  
  const port = Number(process.env.PORT ?? 3000);
  app.listen({ port, host: "0.0.0.0" }).then(() => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
