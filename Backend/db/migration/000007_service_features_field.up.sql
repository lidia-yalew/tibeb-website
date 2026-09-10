ALTER TABLE services
    ADD COLUMN features TEXT[] NOT NULL DEFAULT '{}';