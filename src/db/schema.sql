-- src/db/schema.sql
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  status TEXT,
  order_type TEXT,
  token_in TEXT,
  token_out TEXT,
  amount NUMERIC,
  chosen_dex TEXT,
  executed_price NUMERIC,
  tx_hash TEXT,
  failure_reason TEXT
);
