# Order Execution Engine (Market Orders)

##  Overview
This project implements a **mock Order Execution Engine** that processes **Market Orders**
with DEX routing between **Raydium** and **Meteora**, using Fastify, BullMQ, PostgreSQL,
and WebSocket updates.

##  Tech Stack
Node.js + TypeScript + Fastify + BullMQ + Redis + PostgreSQL

##  Chosen Order Type
**Market Order** – executes immediately at the best available price.
Easiest to demonstrate routing and queue behavior.

*Extension to other order types:*
- **Limit Order** → add price threshold before execution.
- **Sniper Order** → trigger on token launch event.

## API Endpoints
- `POST /api/orders/execute` → submit order, returns `orderId`
- `GET /ws/:orderId` (WebSocket) → stream live status

##  Status Flow
`pending → routing → building → confirmed → failed`

##  Architecture
Fastify REST → BullMQ Queue → Worker → DexRouter → PostgreSQL → WebSocket

##  Setup
```bash
docker compose up -d
npm install
npm run dev
