-- Migration: 2025-09-01T07-45-21 - Comprehensive Schema Sync
-- Generated from database-schema.sql
-- This migration synchronizes all database schemas

-- Modern Men Hair Salon Database Schema
-- Generated from Payload CMS Collections
-- Version: 1.0.0
-- Generated: $(date)

-- =====================================================
-- EXTENSIONS
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff', 'stylist')),
    phone TEXT,
    avatar_id UUID,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,

    -- Permissions
    can_manage_users BOOLEAN DEFAULT FALSE,
    can_manage_services BOOLEAN DEFAULT FALSE,
    can_view_reports BOOLEAN DEFAULT FALSE,
    can_manage_appointments BOOLEAN DEFAULT TRUE,

    -- Schedule
    work_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    start_time TEXT DEFAULT '09:00',
    end_time TEXT DEFAULT '17:00',

    -- Time off
    time_off JSONB DEFAULT '[]',

    -- Specializations (for stylists)
    specializations JSONB DEFAULT '[]',

    -- Certifications
    certifications JSONB DEFAULT '[]',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MEDIA TABLE
-- =====================================================

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    filesize INTEGER,
    mime_type TEXT,
    url TEXT,
    alt TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    sizes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SERVICES TABLE
-- =====================================================

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('haircut', 'color', 'treatment', 'beard', 'special')),
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0), -- Price in cents
    duration INTEGER NOT NULL CHECK (duration >= 5 AND duration <= 480),
    image_id UUID,

    -- Gallery images
    gallery JSONB DEFAULT '[]',

    -- Service details
    preparation_time INTEGER DEFAULT 15 CHECK (preparation_time >= 0 AND preparation_time <= 60),
    buffer_time INTEGER DEFAULT 15 CHECK (buffer_time >= 0 AND buffer_time <= 60),

    -- Skills and products
    required_skills JSONB DEFAULT '[]',
    products JSONB DEFAULT '[]',
    pricing_tiers JSONB DEFAULT '[]',

    -- Loyalty points
    loyalty_points_earned INTEGER DEFAULT 10 CHECK (loyalty_points_earned >= 0),
    loyalty_points_multiplier DECIMAL(3,2) DEFAULT 1.0 CHECK (loyalty_points_multiplier >= 0.5 AND loyalty_points_multiplier <= 5.0),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,

    -- SEO
    seo JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CUSTOMERS TABLE
-- =====================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    secondary_phone TEXT,
    date_of_birth DATE,
    avatar_id UUID,

    -- Hair profile
    hair_type TEXT CHECK (hair_type IN ('straight', 'wavy', 'curly', 'kinky')),
    hair_length TEXT CHECK (hair_length IN ('short', 'medium', 'long', 'very-long')),
    hair_density TEXT CHECK (hair_density IN ('fine', 'medium', 'thick')),
    scalp_condition TEXT CHECK (scalp_condition IN ('normal', 'dry', 'oily', 'sensitive', 'dandruff')),
    chemical_history JSONB DEFAULT '[]',

    -- Preferences
    preferred_stylist_id UUID,
    preferred_services UUID[] DEFAULT ARRAY[]::UUID[],
    email_reminders BOOLEAN DEFAULT TRUE,
    sms_reminders BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT TRUE,
    special_offers BOOLEAN DEFAULT TRUE,
    preferred_days TEXT[] DEFAULT ARRAY[]::TEXT[],
    preferred_times TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Loyalty program
    loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
    loyalty_tier TEXT DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    total_spent INTEGER DEFAULT 0 CHECK (total_spent >= 0), -- Amount in cents
    visit_count INTEGER DEFAULT 0 CHECK (visit_count >= 0),
    member_since DATE DEFAULT CURRENT_DATE,

    -- Emergency contact
    emergency_contact JSONB DEFAULT '{}',

    -- Internal
    notes TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    last_visit DATE,
    next_appointment DATE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STYLISTS TABLE
-- =====================================================

CREATE TABLE stylists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    name TEXT,
    bio TEXT,
    profile_image_id UUID,

    -- Portfolio
    portfolio JSONB DEFAULT '[]',

    -- Specializations
    specializations UUID[] DEFAULT ARRAY[]::UUID[],

    -- Experience
    years_experience INTEGER CHECK (years_experience >= 0 AND years_experience <= 50),
    certifications JSONB DEFAULT '[]',
    awards JSONB DEFAULT '[]',

    -- Schedule
    work_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    work_hours JSONB DEFAULT '{"startTime": "09:00", "endTime": "17:00", "breakStart": "12:00", "breakEnd": "13:00"}',
    time_off JSONB DEFAULT '[]',
    max_appointments_per_day INTEGER DEFAULT 8 CHECK (max_appointments_per_day >= 1 AND max_appointments_per_day <= 20),

    -- Performance
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    total_appointments INTEGER DEFAULT 0 CHECK (total_appointments >= 0),
    on_time_rate DECIMAL(5,2) DEFAULT 100 CHECK (on_time_rate >= 0 AND on_time_rate <= 100),
    average_service_time INTEGER CHECK (average_service_time >= 0),

    -- Pricing
    custom_pricing JSONB DEFAULT '[]',
    hourly_rate INTEGER CHECK (hourly_rate >= 0),

    -- Social media
    social_media JSONB DEFAULT '{}',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- APPOINTMENTS TABLE
-- =====================================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_title TEXT,

    -- Relationships
    customer_id UUID NOT NULL,
    stylist_id UUID NOT NULL,
    service_ids UUID[] NOT NULL,

    -- Scheduling
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL CHECK (duration >= 5 AND duration <= 480),
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'in-progress', 'completed', 'cancelled', 'no-show')),

    -- Pricing
    subtotal INTEGER CHECK (subtotal >= 0),
    discount JSONB DEFAULT '{"amount": 0, "type": "fixed", "reason": ""}',
    tax INTEGER CHECK (tax >= 0),
    total INTEGER CHECK (total >= 0),

    -- Deposit
    deposit_required BOOLEAN DEFAULT FALSE,
    deposit_amount INTEGER CHECK (deposit_amount >= 0),
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_payment_method TEXT CHECK (deposit_payment_method IN ('cash', 'card', 'online')),

    -- Communication
    notes TEXT,
    customer_notes TEXT,
    email_reminder BOOLEAN DEFAULT TRUE,
    sms_reminder BOOLEAN DEFAULT FALSE,
    reminder_time INTEGER DEFAULT 24 CHECK (reminder_time > 0),
    reminder_sent BOOLEAN DEFAULT FALSE,

    -- Check-in
    checked_in BOOLEAN DEFAULT FALSE,
    check_in_time TIMESTAMP WITH TIME ZONE,
    wait_time INTEGER CHECK (wait_time >= 0),

    -- Follow-up
    satisfaction TEXT CHECK (satisfaction IN ('very-satisfied', 'satisfied', 'neutral', 'unsatisfied', 'very-unsatisfied')),
    feedback TEXT,
    next_appointment DATE,
    follow_up_sent BOOLEAN DEFAULT FALSE,

    -- Loyalty
    points_earned INTEGER DEFAULT 0 CHECK (points_earned >= 0),
    points_applied INTEGER DEFAULT 0 CHECK (points_applied >= 0),

    -- Source
    source TEXT DEFAULT 'online' CHECK (source IN ('online', 'phone', 'walk-in', 'referral', 'other')),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Users table foreign keys
ALTER TABLE users ADD CONSTRAINT fk_users_avatar
    FOREIGN KEY (avatar_id) REFERENCES media(id) ON DELETE SET NULL;

-- Services table foreign keys
ALTER TABLE services ADD CONSTRAINT fk_services_image
    FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL;

-- Customers table foreign keys
ALTER TABLE customers ADD CONSTRAINT fk_customers_avatar
    FOREIGN KEY (avatar_id) REFERENCES media(id) ON DELETE SET NULL;
ALTER TABLE customers ADD CONSTRAINT fk_customers_preferred_stylist
    FOREIGN KEY (preferred_stylist_id) REFERENCES stylists(id) ON DELETE SET NULL;

-- Stylists table foreign keys
ALTER TABLE stylists ADD CONSTRAINT fk_stylists_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE stylists ADD CONSTRAINT fk_stylists_profile_image
    FOREIGN KEY (profile_image_id) REFERENCES media(id) ON DELETE SET NULL;

-- Appointments table foreign keys
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_stylist
    FOREIGN KEY (stylist_id) REFERENCES stylists(id) ON DELETE RESTRICT;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Services indexes
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_price ON services(price);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_featured ON services(featured);
CREATE INDEX idx_services_display_order ON services(display_order);
CREATE INDEX idx_services_name_trgm ON services USING gin(name gin_trgm_ops);

-- Customers indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_full_name ON customers(full_name);
CREATE INDEX idx_customers_loyalty_tier ON customers(loyalty_tier);
CREATE INDEX idx_customers_is_active ON customers(is_active);
CREATE INDEX idx_customers_last_visit ON customers(last_visit);
CREATE INDEX idx_customers_email_first_name_last_name ON customers(email, first_name, last_name);

-- Stylists indexes
CREATE INDEX idx_stylists_user_id ON stylists(user_id);
CREATE INDEX idx_stylists_is_active ON stylists(is_active);
CREATE INDEX idx_stylists_featured ON stylists(featured);
CREATE INDEX idx_stylists_display_order ON stylists(display_order);
CREATE INDEX idx_stylists_rating ON stylists(rating);

-- Appointments indexes
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_stylist_id ON appointments(stylist_id);
CREATE INDEX idx_appointments_date_time ON appointments(date_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_created_at ON appointments(created_at);
CREATE INDEX idx_appointments_date_time_status ON appointments(date_time, status);
CREATE INDEX idx_appointments_stylist_date_time ON appointments(stylist_id, date_time);
CREATE INDEX idx_appointments_customer_date_time ON appointments(customer_id, date_time);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Services policies (public read for customers)
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
        )
    );

-- Customers policies
CREATE POLICY "Customers can view their own data" ON customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Staff can view all customers" ON customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff', 'stylist')
        )
    );

CREATE POLICY "Customers can update their own data" ON customers
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff can manage customers" ON customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
        )
    );

-- Appointments policies
CREATE POLICY "Customers can view their own appointments" ON appointments
    FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Stylists can view their assigned appointments" ON appointments
    FOR SELECT USING (stylist_id IN (
        SELECT id FROM stylists WHERE user_id = auth.uid()
    ));

CREATE POLICY "Staff can view all appointments" ON appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
        )
    );

CREATE POLICY "Users can create appointments" ON appointments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Customers can update their pending appointments" ON appointments
    FOR UPDATE USING (
        customer_id = auth.uid() AND status IN ('pending', 'confirmed')
    );

CREATE POLICY "Staff can manage appointments" ON appointments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
        )
    );

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stylists_updated_at BEFORE UPDATE ON stylists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to calculate appointment duration
CREATE OR REPLACE FUNCTION calculate_appointment_duration(service_ids UUID[])
RETURNS INTEGER AS $$
DECLARE
    total_duration INTEGER := 0;
    service_record RECORD;
BEGIN
    FOR service_record IN
        SELECT duration, buffer_time FROM services
        WHERE id = ANY(service_ids) AND is_active = true
    LOOP
        total_duration := total_duration + service_record.duration + COALESCE(service_record.buffer_time, 15);
    END LOOP;

    RETURN total_duration;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate appointment pricing
CREATE OR REPLACE FUNCTION calculate_appointment_pricing(service_ids UUID[], discount_amount INTEGER DEFAULT 0, discount_type TEXT DEFAULT 'fixed')
RETURNS JSON AS $$
DECLARE
    result JSON;
    subtotal INTEGER := 0;
    tax_amount INTEGER := 0;
    total_amount INTEGER := 0;
    service_record RECORD;
BEGIN
    -- Calculate subtotal
    FOR service_record IN
        SELECT price FROM services
        WHERE id = ANY(service_ids) AND is_active = true
    LOOP
        subtotal := subtotal + service_record.price;
    END LOOP;

    -- Calculate tax (8%)
    tax_amount := ROUND(subtotal * 0.08);

    -- Apply discount
    IF discount_type = 'percentage' THEN
        total_amount := subtotal + tax_amount - ROUND(subtotal * discount_amount / 100.0);
    ELSE
        total_amount := subtotal + tax_amount - discount_amount;
    END IF;

    -- Ensure total is not negative
    total_amount := GREATEST(total_amount, 0);

    result := json_build_object(
        'subtotal', subtotal,
        'tax', tax_amount,
        'total', total_amount
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer loyalty tier
CREATE OR REPLACE FUNCTION update_customer_loyalty_tier(customer_id UUID)
RETURNS VOID AS $$
DECLARE
    points INTEGER;
    new_tier TEXT;
BEGIN
    SELECT loyalty_points INTO points FROM customers WHERE id = customer_id;

    IF points >= 700 THEN
        new_tier := 'platinum';
    ELSIF points >= 300 THEN
        new_tier := 'gold';
    ELSIF points >= 100 THEN
        new_tier := 'silver';
    ELSE
        new_tier := 'bronze';
    END IF;

    UPDATE customers SET loyalty_tier = new_tier WHERE id = customer_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check stylist availability
CREATE OR REPLACE FUNCTION check_stylist_availability(
    stylist_id UUID,
    appointment_date TIMESTAMP,
    duration_minutes INTEGER,
    exclude_appointment_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
    work_day TEXT;
    work_hours JSONB;
    start_time TEXT;
    end_time TEXT;
BEGIN
    -- Get day of week
    work_day := LOWER(TRIM(TO_CHAR(appointment_date, 'Day')));

    -- Check if stylist works on this day
    IF NOT EXISTS (
        SELECT 1 FROM stylists
        WHERE id = stylist_id
        AND work_day = ANY(work_days)
    ) THEN
        RETURN FALSE;
    END IF;

    -- Check work hours
    SELECT work_hours INTO work_hours FROM stylists WHERE id = stylist_id;
    start_time := work_hours->>'startTime';
    end_time := work_hours->>'endTime';

    IF appointment_date::time < start_time::time OR
       (appointment_date + INTERVAL '1 minute' * duration_minutes)::time > end_time::time THEN
        RETURN FALSE;
    END IF;

    -- Check for conflicts
    SELECT COUNT(*) INTO conflict_count
    FROM appointments
    WHERE stylist_id = stylist_id
    AND status NOT IN ('cancelled', 'no-show')
    AND id != COALESCE(exclude_appointment_id, '00000000-0000-0000-0000-000000000000'::UUID)
    AND (
        (date_time <= appointment_date AND date_time + INTERVAL '1 minute' * duration > appointment_date) OR
        (date_time >= appointment_date AND date_time < appointment_date + INTERVAL '1 minute' * duration_minutes) OR
        (date_time <= appointment_date AND date_time + INTERVAL '1 minute' * duration >= appointment_date + INTERVAL '1 minute' * duration_minutes)
    );

    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active services view
CREATE VIEW active_services AS
SELECT * FROM services
WHERE is_active = true
ORDER BY display_order, name;

-- Active stylists view
CREATE VIEW active_stylists AS
SELECT
    s.*,
    u.name as user_name,
    u.email as user_email,
    u.role as user_role
FROM stylists s
JOIN users u ON s.user_id = u.id
WHERE s.is_active = true AND u.is_active = true
ORDER BY s.display_order, s.name;

-- Upcoming appointments view
CREATE VIEW upcoming_appointments AS
SELECT
    a.*,
    c.first_name || ' ' || c.last_name as customer_name,
    c.email as customer_email,
    c.phone as customer_phone,
    s.name as stylist_name,
    array_agg(svc.name) as service_names
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN stylists s ON a.stylist_id = s.id
LEFT JOIN services svc ON svc.id = ANY(a.service_ids)
WHERE a.date_time > NOW()
AND a.status NOT IN ('cancelled', 'completed')
GROUP BY a.id, c.id, s.id
ORDER BY a.date_time;

-- Customer loyalty summary view
CREATE VIEW customer_loyalty_summary AS
SELECT
    id,
    first_name || ' ' || last_name as full_name,
    email,
    loyalty_tier,
    loyalty_points,
    total_spent,
    visit_count,
    member_since,
    last_visit,
    CASE
        WHEN loyalty_tier = 'bronze' THEN 100 - loyalty_points
        WHEN loyalty_tier = 'silver' THEN 300 - loyalty_points
        WHEN loyalty_tier = 'gold' THEN 700 - loyalty_points
        ELSE 0
    END as points_to_next_tier
FROM customers
WHERE is_active = true
ORDER BY loyalty_points DESC;

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert default admin user (password should be hashed)
-- Note: This is just a template - actual password hashing should be done in application
INSERT INTO users (name, email, role, is_active, can_manage_users, can_manage_services, can_view_reports, can_manage_appointments)
VALUES ('Admin User', 'admin@modernmen.com', 'admin', true, true, true, true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample services
INSERT INTO services (name, category, description, price, duration, is_active) VALUES
('Men''s Haircut', 'haircut', 'Professional men''s haircut with styling', 3500, 30, true),
('Beard Trim', 'beard', 'Professional beard trimming and shaping', 2000, 15, true),
('Hair Color', 'color', 'Full hair coloring service', 7500, 90, true),
('Scalp Treatment', 'treatment', 'Deep conditioning scalp treatment', 5000, 45, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Salon staff and administrators with roles and permissions';
COMMENT ON TABLE services IS 'Hair salon services with pricing and details';
COMMENT ON TABLE customers IS 'Client database with loyalty programs and preferences';
COMMENT ON TABLE stylists IS 'Professional stylists with schedules and performance metrics';
COMMENT ON TABLE appointments IS 'Customer appointments with full scheduling and payment details';
COMMENT ON TABLE media IS 'File uploads and media assets';

COMMENT ON COLUMN services.price IS 'Price in cents (divide by 100 for dollars)';
COMMENT ON COLUMN customers.total_spent IS 'Total spent in cents';
COMMENT ON COLUMN appointments.subtotal IS 'Subtotal in cents';
COMMENT ON COLUMN appointments.tax IS 'Tax amount in cents';
COMMENT ON COLUMN appointments.total IS 'Total amount in cents';

-- =====================================================
-- END OF SCHEMA
-- =====================================================


-- Migration completed at: 2025-09-01T07:45:21.001Z
