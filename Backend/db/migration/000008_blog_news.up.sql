CREATE TABLE blog_news
(
    id            UUID PRIMARY KEY    DEFAULT gen_random_uuid(),
    category      VARCHAR(10) NOT NULL,                          -- 'blog' | 'news'
    title         VARCHAR(300) NOT NULL,
    slug          VARCHAR(300) NOT NULL UNIQUE,
    excerpt       TEXT,                                          -- short summary / teaser
    content       TEXT        NOT NULL,                          -- rich text / HTML body
    author_name   VARCHAR(200) NOT NULL,                         -- org name or individual name
    source        VARCHAR(200),                                  -- news source/outlet (news only)
    display_order INTEGER     NOT NULL DEFAULT 0,
    is_published  BOOLEAN     NOT NULL DEFAULT FALSE,
    published_at  TIMESTAMPTZ,                                   -- set when first published
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_blog_news_category CHECK (category IN ('blog', 'news'))
);

-- Index for fast public queries (published posts by category)
CREATE INDEX idx_blog_news_category_published ON blog_news (category, is_published);

-- Index for slug lookup (public single-post route)
CREATE INDEX idx_blog_news_slug ON blog_news (slug);

-- Index for ordering in lists
CREATE INDEX idx_blog_news_display_order ON blog_news (display_order ASC, created_at DESC);

