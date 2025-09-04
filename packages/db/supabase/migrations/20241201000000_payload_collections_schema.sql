-- PayloadCMS Collections Schema Migration
-- Generated from src/payload.config.ts and collection definitions
-- This migration creates all PayloadCMS collections as PostgreSQL tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE PAYLOAD TABLES
-- ============================================================================

-- Payload Tenants Collection
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending', 'deactivated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payload Media Collection
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    alt TEXT,
    caption TEXT,
    seo_title TEXT,
    seo_description TEXT,
    keywords TEXT,
    mime_type TEXT,
    filesize INTEGER,
    width INTEGER,
    height INTEGER,
    sizes JSONB DEFAULT '{}',
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payload Settings Collection
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    value JSONB,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BUSINESS COLLECTIONS
-- ============================================================================

-- Customers Collection
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    date_of_birth DATE,
    address JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    loyalty_points INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    last_visit TIMESTAMPTZ,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Collection
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    image_id UUID REFERENCES media(id) ON DELETE SET NULL,
    features JSONB DEFAULT '[]',
    booking_settings JSONB DEFAULT '{}',
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stylists Collection
CREATE TABLE IF NOT EXISTS stylists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    bio TEXT,
    profile_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    experience_years INTEGER,
    specialties TEXT[],
    working_hours JSONB DEFAULT '{}',
    services_offered UUID[] DEFAULT '{}',
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments Collection
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    price DECIMAL(10,2),
    duration_minutes INTEGER,
    reminder_sent BOOLEAN DEFAULT FALSE,
    customer_notes TEXT,
    internal_notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Collection
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    brand TEXT,
    sku TEXT UNIQUE,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    image_id UUID REFERENCES media(id) ON DELETE SET NULL,
    images JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations Collection
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    coordinates JSONB DEFAULT '{}',
    working_hours JSONB DEFAULT '{}',
    services_available UUID[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTENT MANAGEMENT COLLECTIONS
-- ============================================================================

-- Pages Collection
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB,
    excerpt TEXT,
    featured_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    og_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
    template TEXT,
    parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BUSINESS LOGIC COLLECTIONS
-- ============================================================================

-- Commissions Collection
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stylist_id UUID REFERENCES stylists(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    base_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    payment_date TIMESTAMPTZ,
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Loyalty Collection
CREATE TABLE IF NOT EXISTS customer_loyalty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    points_earned INTEGER DEFAULT 0,
    points_used INTEGER DEFAULT 0,
    current_balance INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    tier_expires_at TIMESTAMPTZ,
    total_spent DECIMAL(10,2) DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    last_visit TIMESTAMPTZ,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty Programs Collection
CREATE TABLE IF NOT EXISTS loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    points_per_dollar DECIMAL(5,2) DEFAULT 1.00,
    tiers JSONB DEFAULT '[]',
    rewards JSONB DEFAULT '[]',
    expiry_months INTEGER DEFAULT 12,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty Rewards Collection
CREATE TABLE IF NOT EXISTS loyalty_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    reward_type TEXT NOT NULL CHECK (reward_type IN ('discount', 'service', 'product', 'free_session')),
    reward_value JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date TIMESTAMPTZ,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Packages Collection
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    services JSONB DEFAULT '[]',
    total_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    duration_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    image_id UUID REFERENCES media(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INVENTORY MANAGEMENT
-- ============================================================================

-- Inventory Collection
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    quantity_on_hand INTEGER DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    quantity_available INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER,
    reorder_point INTEGER,
    last_inventory_date TIMESTAMPTZ,
    cost_per_unit DECIMAL(10,2),
    supplier_id UUID,
    batch_number TEXT,
    expiry_date DATE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers Collection
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address JSONB DEFAULT '{}',
    payment_terms TEXT,
    lead_time_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    products_supplied UUID[] DEFAULT '{}',
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STAFF MANAGEMENT
-- ============================================================================

-- Employees Collection
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    date_of_birth DATE,
    hire_date DATE NOT NULL,
    termination_date DATE,
    position TEXT NOT NULL,
    department TEXT,
    salary DECIMAL(10,2),
    hourly_rate DECIMAL(8,2),
    working_hours JSONB DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Clock Collection
CREATE TABLE IF NOT EXISTS time_clock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    clock_in TIMESTAMPTZ NOT NULL,
    clock_out TIMESTAMPTZ,
    break_start TIMESTAMPTZ,
    break_end TIMESTAMPTZ,
    total_hours DECIMAL(6,2),
    regular_hours DECIMAL(6,2),
    overtime_hours DECIMAL(6,2),
    notes TEXT,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll Collection
CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    gross_pay DECIMAL(10,2) NOT NULL,
    deductions DECIMAL(10,2) DEFAULT 0,
    net_pay DECIMAL(10,2) NOT NULL,
    hours_worked DECIMAL(6,2),
    overtime_hours DECIMAL(6,2),
    bonus DECIMAL(10,2) DEFAULT 0,
    commissions DECIMAL(10,2) DEFAULT 0,
    taxes JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid')),
    payment_date TIMESTAMPTZ,
    payment_method TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Schedules Collection
CREATE TABLE IF NOT EXISTS employee_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    is_available BOOLEAN DEFAULT TRUE,
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, schedule_date)
);

-- ============================================================================
-- NOTIFICATIONS & COMMUNICATIONS
-- ============================================================================

-- Notifications Collection
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('user', 'customer', 'employee', 'all')),
    recipient_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SALES & ANALYTICS
-- ============================================================================

-- Sales Collection
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
    services JSONB DEFAULT '[]',
    products JSONB DEFAULT '[]',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled')),
    transaction_id TEXT,
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WAITLIST & BOOKING MANAGEMENT
-- ============================================================================

-- Wait List Collection
CREATE TABLE IF NOT EXISTS wait_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
    preferred_date DATE,
    preferred_time TIME,
    flexibility_days INTEGER DEFAULT 0,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'contacted', 'scheduled', 'expired', 'cancelled')),
    contacted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DOCUMENTATION & WORKFLOWS
-- ============================================================================

-- Documentation Collection
CREATE TABLE IF NOT EXISTS documentation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content JSONB,
    type TEXT NOT NULL CHECK (type IN ('procedure', 'policy', 'training', 'reference')),
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    version TEXT DEFAULT '1.0',
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewers UUID[] DEFAULT '{}',
    approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft', 'review', 'approved', 'rejected')),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentation Templates Collection
CREATE TABLE IF NOT EXISTS documentation_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    template_content JSONB,
    template_type TEXT NOT NULL CHECK (template_type IN ('procedure', 'policy', 'training', 'reference')),
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentation Workflows Collection
CREATE TABLE IF NOT EXISTS documentation_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documentation_id UUID REFERENCES documentation(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    step_type TEXT NOT NULL CHECK (step_type IN ('create', 'review', 'approve', 'publish')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_tenant ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stylists_email ON stylists(email);
CREATE INDEX IF NOT EXISTS idx_stylists_tenant ON stylists(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_stylist ON appointments(stylist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_tenant ON locations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_tenant ON pages(tenant_id);

-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables with updated_at column
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN (
            'tenants', 'media', 'settings', 'customers', 'services', 'stylists',
            'appointments', 'products', 'locations', 'pages', 'commissions',
            'customer_loyalty', 'loyalty_programs', 'loyalty_rewards',
            'service_packages', 'inventory', 'suppliers', 'employees',
            'time_clock', 'payroll', 'employee_schedules', 'notifications',
            'sales', 'wait_list', 'documentation', 'documentation_templates',
            'documentation_workflows'
        )
    LOOP
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', table_name, table_name);
    END LOOP;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_clock ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE wait_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation_workflows ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (these can be customized based on business requirements)
-- Public read access for published content
CREATE POLICY "Published pages are viewable by everyone" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Active services are viewable by everyone" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (in_stock = true);

-- Authenticated user policies
CREATE POLICY "Users can view their own profile" ON customers
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own appointments" ON appointments
  FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can view their own loyalty info" ON customer_loyalty
  FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Admin policies (assuming admin role)
CREATE POLICY "Admins can manage all tenants" ON tenants
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all customers" ON customers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all appointments" ON appointments
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default tenant
INSERT INTO tenants (name, email, status) VALUES
('Modern Men Hair Salon', 'admin@modernmen.com', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (name, description, price, duration_minutes, category, is_active) VALUES
('Men''s Haircut', 'Professional men''s haircut with styling', 35.00, 45, 'Haircuts', true),
('Beard Trim', 'Expert beard trimming and shaping', 20.00, 20, 'Grooming', true),
('Hair & Beard Combo', 'Complete haircut and beard grooming package', 50.00, 60, 'Packages', true),
('Hair Coloring', 'Professional hair coloring services', 75.00, 90, 'Color', true),
('Scalp Treatment', 'Deep conditioning scalp treatment', 40.00, 30, 'Treatments', true)
ON CONFLICT DO NOTHING;

-- Insert sample locations
INSERT INTO locations (name, address, phone, is_active) VALUES
('Downtown Location', '123 Main Street, Downtown', '(555) 123-4567', true),
('Uptown Location', '456 Oak Avenue, Uptown', '(555) 987-6543', true)
ON CONFLICT DO NOTHING;
