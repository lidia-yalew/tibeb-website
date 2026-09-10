CREATE TABLE testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name VARCHAR(150) NOT NULL,
  reviewer_role VARCHAR(150),             -- e.g. "CEO at XYZ Company"
  company_name  VARCHAR(150),
  content       TEXT NOT NULL,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
