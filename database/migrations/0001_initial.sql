PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','blocked','pending')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE
);

CREATE TABLE user_roles (
  user_id TEXT NOT NULL REFERENCES users(id),
  role_id TEXT NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE customer_addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT,
  city TEXT NOT NULL DEFAULT 'Sari',
  address TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE motorcycle_brands (
  id TEXT PRIMARY KEY,
  name_fa TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE motorcycle_models (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES motorcycle_brands(id),
  name_fa TEXT NOT NULL,
  name_en TEXT,
  engine_cc INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE motorcycle_variants (
  id TEXT PRIMARY KEY,
  model_id TEXT NOT NULL REFERENCES motorcycle_models(id),
  name_fa TEXT NOT NULL,
  name_en TEXT,
  generation TEXT,
  UNIQUE(model_id, name_fa)
);

CREATE TABLE customer_motorcycles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  variant_id TEXT NOT NULL REFERENCES motorcycle_variants(id),
  model_year INTEGER,
  plate_number TEXT,
  nickname TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_categories (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES product_categories(id),
  name_fa TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES product_categories(id),
  sku TEXT UNIQUE,
  name_fa TEXT NOT NULL,
  name_en TEXT,
  description_fa TEXT,
  description_en TEXT,
  part_number TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_fitments (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT NOT NULL REFERENCES motorcycle_variants(id),
  year_from INTEGER,
  year_to INTEGER,
  verification_status TEXT NOT NULL DEFAULT 'needs_verification'
    CHECK (verification_status IN ('confirmed','needs_verification','not_compatible')),
  verified_by TEXT REFERENCES users(id),
  verified_at TEXT,
  notes TEXT,
  UNIQUE(product_id, variant_id, year_from, year_to)
);

CREATE TABLE suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Sari',
  notes TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier_product_quotes (
  id TEXT PRIMARY KEY,
  supplier_id TEXT NOT NULL REFERENCES suppliers(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quoted_price_irr INTEGER,
  availability TEXT NOT NULL CHECK (availability IN ('in_stock','out_of_stock','limited','unknown','needs_confirmation')),
  lead_time_minutes INTEGER,
  quoted_at TEXT NOT NULL,
  valid_until TEXT,
  confirmation_status TEXT NOT NULL DEFAULT 'unconfirmed'
    CHECK (confirmation_status IN ('unconfirmed','confirmed','expired')),
  notes TEXT,
  created_by TEXT REFERENCES users(id)
);

CREATE TABLE customer_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  motorcycle_id TEXT REFERENCES customer_motorcycles(id),
  address_id TEXT REFERENCES customer_addresses(id),
  delivery_address_text TEXT,
  customer_note TEXT,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','awaiting_supplier_quote','quote_ready','awaiting_customer_approval','approved','rejected','quote_expired','sourcing','ready_for_delivery','delivered','completed','cancelled')),
  requested_installation INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  customer_note TEXT
);

CREATE TABLE customer_quotes (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES customer_orders(id),
  version INTEGER NOT NULL,
  parts_total_irr INTEGER NOT NULL DEFAULT 0,
  delivery_fee_irr INTEGER NOT NULL DEFAULT 0,
  installation_fee_irr INTEGER NOT NULL DEFAULT 0,
  service_fee_irr INTEGER NOT NULL DEFAULT 0,
  grand_total_irr INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','sent','approved','rejected','expired','superseded')),
  quoted_at TEXT NOT NULL,
  valid_until TEXT,
  created_by TEXT REFERENCES users(id),
  customer_response_at TEXT,
  UNIQUE(order_id, version)
);

CREATE TABLE customer_quote_items (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES customer_quotes(id) ON DELETE CASCADE,
  order_item_id TEXT REFERENCES customer_order_items(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_irr INTEGER NOT NULL,
  line_total_irr INTEGER NOT NULL,
  supplier_id TEXT REFERENCES suppliers(id),
  supplier_quote_id TEXT REFERENCES supplier_product_quotes(id)
);

CREATE TABLE service_catalog (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('maintenance','repair','tire','battery')),
  name_fa TEXT NOT NULL,
  name_en TEXT,
  description_fa TEXT,
  description_en TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE service_prices (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES service_catalog(id),
  price_irr INTEGER NOT NULL CHECK (price_irr >= 0),
  effective_from TEXT NOT NULL,
  effective_to TEXT,
  created_by TEXT REFERENCES users(id)
);

CREATE TABLE service_jobs (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES users(id),
  motorcycle_id TEXT REFERENCES customer_motorcycles(id),
  service_id TEXT REFERENCES service_catalog(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address_text TEXT NOT NULL,
  issue_description TEXT,
  preferred_at TEXT,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested','confirmed','assigned','on_the_way','in_progress','awaiting_customer_approval','completed','cancelled')),
  fixed_service_price_irr INTEGER,
  mechanic_user_id TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_collections (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES customer_orders(id),
  service_job_id TEXT REFERENCES service_jobs(id),
  expected_amount_irr INTEGER NOT NULL,
  received_amount_irr INTEGER NOT NULL DEFAULT 0,
  method TEXT CHECK (method IN ('cash','pos','bank_transfer','other')),
  collected_by TEXT REFERENCES users(id),
  collected_at TEXT,
  receipt_reference TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (status IN ('unpaid','partially_collected','collected','refunded')),
  CHECK (order_id IS NOT NULL OR service_job_id IS NOT NULL)
);

CREATE TABLE telegram_outbox (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at TEXT
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_motorcycle_models_brand ON motorcycle_models(brand_id);
CREATE INDEX idx_variants_model ON motorcycle_variants(model_id);
CREATE INDEX idx_fitments_variant_status ON product_fitments(variant_id, verification_status);
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_supplier_quotes_product_time ON supplier_product_quotes(product_id, quoted_at DESC);
CREATE INDEX idx_orders_status_created ON customer_orders(status, created_at DESC);
CREATE INDEX idx_order_items_order ON customer_order_items(order_id);
CREATE INDEX idx_customer_motorcycles_user ON customer_motorcycles(user_id);
CREATE INDEX idx_service_jobs_status_created ON service_jobs(status, created_at DESC);
CREATE INDEX idx_telegram_outbox_status ON telegram_outbox(status, created_at);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id, created_at DESC);

INSERT INTO roles (id, code) VALUES
  ('role-admin', 'admin'),
  ('role-mechanic', 'mechanic'),
  ('role-customer', 'customer');
