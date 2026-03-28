-- ============================================================
-- AutoOps Price Intelligence Agent — Supabase Schema
-- Run this entire block in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE 1: products
-- Stores the user's product catalog
-- ============================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    your_price DECIMAL(10, 2) NOT NULL,
    target_margin DECIMAL(5, 2) DEFAULT 20.00,
    image_url TEXT,
    amazon_search_query VARCHAR(255),
    flipkart_search_query VARCHAR(255),
    myntra_search_query VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 2: price_history
-- Every price data point extracted by TinyFish agents
-- ============================================================
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    scan_id UUID,                          -- linked to scan_runs
    platform VARCHAR(50) NOT NULL,         -- 'amazon' | 'flipkart' | 'myntra'
    price DECIMAL(10, 2),
    original_price DECIMAL(10, 2),         -- before discount
    discount_percent DECIMAL(5, 2),
    stock_status VARCHAR(50),              -- 'in_stock' | 'out_of_stock' | 'limited'
    rating DECIMAL(3, 2),
    rating_count INTEGER,
    product_url TEXT,
    scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 3: alerts
-- Price drop or stock change alerts
-- ============================================================
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    scan_id UUID,
    platform VARCHAR(50) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,       -- 'price_drop' | 'price_spike' | 'out_of_stock' | 'back_in_stock' | 'undercut'
    old_price DECIMAL(10, 2),
    new_price DECIMAL(10, 2),
    price_gap_percent DECIMAL(6, 2),       -- difference vs your price
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 4: scan_runs
-- Every scan job triggered by user
-- ============================================================
CREATE TABLE scan_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending' | 'running' | 'completed' | 'failed'
    platforms TEXT[] DEFAULT ARRAY['amazon', 'flipkart', 'myntra'],
    total_products INTEGER DEFAULT 0,
    scanned_products INTEGER DEFAULT 0,
    alerts_generated INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    error_message TEXT
);

-- ============================================================
-- TABLE 5: scan_run_products
-- Junction table — which products were in which scan
-- ============================================================
CREATE TABLE scan_run_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID NOT NULL REFERENCES scan_runs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending' | 'scanning' | 'done' | 'failed'
    UNIQUE(scan_id, product_id)
);

-- ============================================================
-- TABLE 6: ai_recommendations
-- LLM-generated repricing advice per product per scan
-- ============================================================
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    scan_id UUID REFERENCES scan_runs(id) ON DELETE SET NULL,
    suggested_price DECIMAL(10, 2),
    current_your_price DECIMAL(10, 2),
    best_competitor_price DECIMAL(10, 2),
    best_competitor_platform VARCHAR(50),
    recommendation_type VARCHAR(50),       -- 'lower_price' | 'match_price' | 'hold' | 'raise_price'
    reasoning TEXT,
    confidence_score DECIMAL(3, 2),        -- 0.00 to 1.00
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES — for fast queries on common lookups
-- ============================================================
CREATE INDEX idx_price_history_product_id ON price_history(product_id);
CREATE INDEX idx_price_history_platform ON price_history(platform);
CREATE INDEX idx_price_history_scanned_at ON price_history(scanned_at DESC);
CREATE INDEX idx_alerts_product_id ON alerts(product_id);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_scan_run_products_scan_id ON scan_run_products(scan_id);
CREATE INDEX idx_ai_recommendations_product_id ON ai_recommendations(product_id);

-- ============================================================
-- AUTO-UPDATE updated_at on products
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA — 5 sample Indian clothing products
-- ============================================================
INSERT INTO products (name, category, your_price, target_margin, amazon_search_query, flipkart_search_query, myntra_search_query) VALUES
('Blue Cotton Kurta', 'Ethnic Wear', 899.00, 25.00, 'blue cotton kurta women', 'blue cotton kurta women', 'blue-cotton-kurta'),
('Men''s Polo T-Shirt', 'Casual Wear', 599.00, 20.00, 'mens polo t-shirt cotton', 'mens polo tshirt', 'men-polo-tshirt'),
('Women''s Ethnic Dress', 'Ethnic Wear', 1299.00, 30.00, 'women ethnic dress cotton', 'women ethnic dress', 'women-ethnic-dress'),
('Kids Printed T-Shirt', 'Kids Wear', 399.00, 22.00, 'kids printed tshirt cotton', 'kids printed tshirt', 'kids-printed-tshirt'),
('Floral Maxi Dress', 'Western Wear', 1099.00, 28.00, 'floral maxi dress women', 'floral maxi dress women', 'floral-maxi-dress');