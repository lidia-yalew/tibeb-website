-- Remove 'blog_post' and 'news', add 'blog_news'
ALTER TABLE images
    DROP CONSTRAINT chk_images_entity_type;

ALTER TABLE images
    ADD CONSTRAINT chk_images_entity_type
        CHECK (entity_type IN ('product', 'blog_news', 'event', 'service', 'testimonial'));
