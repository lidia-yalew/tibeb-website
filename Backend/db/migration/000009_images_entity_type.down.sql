-- Revert back to original allowed values
ALTER TABLE images
    DROP CONSTRAINT chk_images_entity_type;

ALTER TABLE images
    ADD CONSTRAINT chk_images_entity_type
        CHECK (entity_type IN ('product', 'blog_post', 'event', 'service', 'news', 'testimonial'));
