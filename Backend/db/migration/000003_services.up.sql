CREATE TABLE services
(
    id            UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    title         VARCHAR(200) NOT NULL,
    description   TEXT         NOT NULL,
    display_order INTEGER      NOT NULL DEFAULT 0,
    is_published  BOOLEAN      NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
