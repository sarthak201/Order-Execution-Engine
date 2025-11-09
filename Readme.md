# Order Execution Engine

## 1. Overview
The **Order Execution Engine** is a backend service that simulates a real-time trading system.  
It supports REST API order submission, WebSocket updates, and background job processing using BullMQ.  
It integrates with PostgreSQL for persistence and includes automated testing with Jest and Supertest.

---

## 2. Features
- REST API for submitting and managing orders  
- Real-time WebSocket updates  
- Background job queue using BullMQ (Redis)  
- PostgreSQL integration  
- Unit, integration, and load testing  
- Fastify-based architecture for performance

---

## 3. System Requirements
| Requirement | Version / Notes |
|--------------|----------------|
| Node.js | v18 or above |
| npm | v9 or above |
| PostgreSQL | Running locally or via Docker |
| Redis | Required for BullMQ |

---

## 4. Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/order-exec-engine.git
cd order-exec-engine
Step 2: Install Dependencies
npm install

Step 3: Create Environment Configuration

Create a .env file in the project root and add the following:

PORT=3000
REDIS_URL=redis://localhost:6379
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=orders

5. Running the Application
Development Mode
npm run dev

Running Redis and PostgreSQL (Optional via Docker)
docker run -d -p 6379:6379 redis
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres


The server should start on:

http://localhost:3000

6. API Endpoints
POST /api/orders/execute

Description: Submit a new order for execution.

Headers:

Content-Type: application/json


Request Body Example:

{
  "orderType": "market",
  "tokenIn": "SOL",
  "tokenOut": "USDC",
  "amount": 1
}


Response Example:

{
  "message": "Order placed successfully",
  "orderId": "b123a45c-6f9e-4efb-8d56-d45fced234a2"
}

7. WebSocket Endpoint

Endpoint:

ws://localhost:3001/ws/:orderId


Description:
Connect to this endpoint to receive live updates for a specific order.

Example Messages:

{ "orderId": "123", "status": "processing" }
{ "orderId": "123", "status": "completed" }

8. Testing

Run all tests:

npm test


To detect unclosed async handles:

npm test -- --detectOpenHandles

9. Demo Instructions (For Video Recording)

Start Redis and PostgreSQL

docker start redis
docker start postgres


Start the Fastify Server

npm run dev


Confirm in terminal:

Server running at http://localhost:3000
WebSocket listening on port 3001


Test API in Postman

Method: POST

URL: http://localhost:3000/api/orders/execute

Headers:
Content-Type: application/json

Body (raw JSON):

{
  "orderType": "market",
  "tokenIn": "SOL",
  "tokenOut": "USDC",
  "amount": 1
}


Click Send — You should receive an order ID in the response.

Connect via WebSocket
Use Postman or wscat:

wscat -c ws://localhost:3001/ws/<orderId>


You’ll see real-time status updates.

Run Tests

npm test


Wait for all test cases to pass.

10. Troubleshooting
Issue	Cause	Fix
400 Bad Request	JSON not parsed	Ensure Content-Type: application/json header is present
404 Not Found	Wrong method or URL	Use POST /api/orders/execute
Redis connection error	Redis not running	Start Redis via Docker or local
PostgreSQL connection refused	Database not started	Run PostgreSQL container or local service
11. Technologies Used

Node.js (TypeScript)

Fastify (web framework)

BullMQ (job queue)

WebSocket (ws)

PostgreSQL

Jest / Supertest (testing framework)

12. Project Structure
src/
 ├── app.ts
 ├── routes/
 │    └── execute.ts
 ├── ws/
 │    └── hub.ts
 ├── queue/
 │    ├── index.ts
 │    └── processor.ts
 ├── dex/
 │    └── DexRouter.ts
 └── db/
      └── pg.ts

tests/
 ├── api.test.ts
 ├── websocket.test.ts
 ├── integration.test.ts
 ├── load.test.ts
 ├── schema.test.ts
 ├── worker.test.ts
 └── queue.test.ts

13. License

This project is developed for academic and learning purposes.