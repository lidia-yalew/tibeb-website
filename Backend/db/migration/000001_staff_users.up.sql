CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE staff_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    VARCHAR(150) NOT NULL,
  last_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  role          VARCHAR(50) NOT NULL DEFAULT 'Editor',
  status        VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
