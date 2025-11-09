import type { FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";

const connections = new Map<
  string,
  { send: (data: string) => void; readyState?: number; close?: () => void; on?: (event: string, handler: Function) => void }
>();

export async function registerWs(app: FastifyInstance) {
  try {
    await app.register(websocket);
  } catch (err: unknown) {
  }

  app.get("/ws/:orderId", { websocket: true }, (connection: any, req) => {
    const { orderId } = req.params as { orderId: string };

    const socket = connection.socket || connection;
    
    if (!socket) {
      console.error(`No socket found in connection for order ${orderId}`);
      return;
    }

    if (typeof socket.send !== "function") {
      console.error(`Socket does not have send method for order ${orderId}`);
      return;
    }

    const wsSocket = connection.socket || socket;
    connections.set(orderId, wsSocket);

    console.log(`Client connected for order ${orderId}`);

    try {
      wsSocket.send(JSON.stringify({ orderId, status: "connected" }));
    } catch (e) {
    }

    const updates = ["pending", "routing", "building", "confirmed"];
    let index = 0;

    const interval = setInterval(() => {
      const currentSocket = connections.get(orderId);
      if (!currentSocket || currentSocket.readyState !== 1) {
        clearInterval(interval);
        connections.delete(orderId);
        return;
      }

      if (index < updates.length) {
        try {
          currentSocket.send(JSON.stringify({ orderId, status: updates[index++] }));
        } catch (e) {
          clearInterval(interval);
          connections.delete(orderId);
        }
      } else {
        clearInterval(interval);
        try {
          if (currentSocket.close) {
            currentSocket.close();
          }
        } catch (e) {
        }
        connections.delete(orderId);
      }
    }, 500);

    if (wsSocket.on) {
      wsSocket.on("close", () => {
        clearInterval(interval);
        connections.delete(orderId);
        if (process.env.NODE_ENV !== "test") {
          console.log(`WebSocket closed for order ${orderId}`);
        }
      });

      wsSocket.on("error", (err: any) => {
        clearInterval(interval);
        connections.delete(orderId);
        if (process.env.NODE_ENV !== "test") {
          console.error(`WebSocket error for order ${orderId}:`, err);
        }
      });
    }
  });
}

export async function publish(orderId: string | undefined, data: any) {
  if (!orderId) {
    if (process.env.NODE_ENV !== "test") {
      console.warn("publish called with undefined orderId", data);
    }
    return;
  }
  const socket = connections.get(String(orderId));
  if (socket && socket.readyState === 1) {
    try {
      socket.send(JSON.stringify(data));
    } catch (err) {
      if (process.env.NODE_ENV !== "test") {
        console.warn("failed to send ws message", err);
      }
    }
  } else {
    if (process.env.NODE_ENV !== "test") {
      console.warn(`No active WebSocket client for order ${orderId}`);
    }
  }
}
