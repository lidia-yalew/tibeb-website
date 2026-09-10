CREATE TABLE contact_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(50),
  organization  VARCHAR(255),
  subject       VARCHAR(300),
  message       TEXT NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'unread',
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
