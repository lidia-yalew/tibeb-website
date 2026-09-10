CREATE TABLE products
(
    id            UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    name          VARCHAR(200) NOT NULL,
    description   TEXT         NOT NULL,
    category      VARCHAR(100), -- plain text, e.g. "Gaming", "Enterprise"
    website_url   TEXT,
    display_order INTEGER      NOT NULL DEFAULT 0,
    is_published  BOOLEAN      NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
