CREATE TABLE images
(
    id                   UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    entity_type          VARCHAR(50) NOT NULL,
    entity_id            UUID        NOT NULL,
    url                  TEXT        NOT NULL,               -- Cloudinary CDN URL
    cloudinary_public_id TEXT,                               -- needed to delete from Cloudinary
    caption              TEXT,                               -- alt text / label
    display_order        INTEGER     NOT NULL DEFAULT 0,
    is_cover             BOOLEAN     NOT NULL DEFAULT false, -- primary/thumbnail image
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_images_entity_type CHECK (entity_type IN (
                                                             'product', 'blog_post', 'event',
                                                             'service', 'news', 'testimonial'
        ))
);

-- Fast lookup by entity (most common query pattern)
CREATE INDEX idx_images_entity ON images (entity_type, entity_id);

-- Enforce only one cover image per entity
CREATE UNIQUE INDEX idx_images_one_cover
    ON images (entity_type, entity_id)
    WHERE is_cover = true;
