-- =============================================================================
-- MODERN MEN HAIR SALON - INITIAL DATABASE SCHEMA
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- USERS TABLE - Authentication and user management
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences (separate table for better organization)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    notifications BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================================================================
-- CUSTOMERS TABLE - Customer relationship management
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
    avatar TEXT,

    -- Address information
    street_address TEXT,
    city TEXT,
    state_province TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'USA',

    -- Loyalty program
    loyalty_tier TEXT DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    loyalty_points INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0, -- Amount in cents
    visit_count INTEGER DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Communication preferences
    email_marketing BOOLEAN DEFAULT true,
    sms_marketing BOOLEAN DEFAULT true,
    appointment_reminders BOOLEAN DEFAULT true,
    birthday_messages BOOLEAN DEFAULT true,

    -- Referral system
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.customers(id),
    referral_bonus_earned INTEGER DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT true,
    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer preferences (separate table)
CREATE TABLE IF NOT EXISTS public.customer_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,

    -- Preferred staff
    preferred_staff_id UUID REFERENCES public.staff(id),

    -- Preferred services (many-to-many)
    preferred_service_ids UUID[],

    -- Preferred times
    preferred_days TEXT[], -- Array of days: 'monday', 'tuesday', etc.
    preferred_time_slots TEXT[], -- Array of time preferences: 'morning', 'afternoon', 'evening'

    -- Special requirements
    allergies TEXT,
    special_requests TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id)
);

-- =============================================================================
-- STAFF TABLE - Staff management and scheduling
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,

    -- Role and specialization
    role TEXT NOT NULL DEFAULT 'barber' CHECK (role IN ('barber', 'stylist', 'manager', 'receptionist', 'apprentice')),
    specialties TEXT[], -- Array of specialties
    bio TEXT,
    avatar TEXT,

    -- Employment details
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    hourly_rate INTEGER, -- Rate in cents
    commission_rate DECIMAL(5,2), -- Commission percentage

    -- Working hours (JSON structure for flexibility)
    working_hours JSONB DEFAULT '{
        "monday": {"start": "09:00", "end": "17:00", "isWorking": true},
        "tuesday": {"start": "09:00", "end": "17:00", "isWorking": true},
        "wednesday": {"start": "09:00", "end": "17:00", "isWorking": true},
        "thursday": {"start": "09:00", "end": "17:00", "isWorking": true},
        "friday": {"start": "09:00", "end": "17:00", "isWorking": true},
        "saturday": {"start": "09:00", "end": "17:00", "isWorking": true},
        "sunday": {"start": "09:00", "end": "17:00", "isWorking": false}
    }',

    -- Performance tracking
    rating DECIMAL(3,2), -- Average rating 1-5
    total_appointments INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    revenue_generated INTEGER DEFAULT 0, -- Amount in cents

    -- Emergency contact
    emergency_contact_name TEXT,
    emergency_contact_relationship TEXT,
    emergency_contact_phone TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff vacation and time off
CREATE TABLE IF NOT EXISTS public.staff_time_off (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT CHECK (reason IN ('vacation', 'sick', 'personal', 'training')),
    approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SERVICES TABLE - Service catalog and pricing
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'haircuts', 'hair-color', 'hair-treatments', 'beard-grooming',
        'facial-treatments', 'massage', 'packages'
    )),
    price INTEGER NOT NULL, -- Price in cents
    duration INTEGER NOT NULL DEFAULT 60, -- Duration in minutes
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,

    -- Service images (array of URLs)
    images TEXT[],

    -- Service benefits and details
    benefits TEXT[],
    preparation_instructions TEXT,
    aftercare_instructions TEXT,

    -- Booking settings
    advance_booking_days INTEGER DEFAULT 30,
    cancellation_hours INTEGER DEFAULT 24,
    requires_deposit BOOLEAN DEFAULT false,
    deposit_percentage DECIMAL(5,2) DEFAULT 25.00,

    -- Analytics
    total_bookings INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    popularity_score DECIMAL(5,2),

    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- APPOINTMENTS TABLE - Core booking system
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    -- Relationships
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,

    -- Customer info snapshot (for quick access)
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,

    -- Appointment details
    appointment_date DATE NOT NULL,
    start_time TEXT NOT NULL, -- Format: HH:MM
    duration INTEGER NOT NULL DEFAULT 60,
    end_time TEXT GENERATED ALWAYS AS (
        (start_time::TIME + (duration || ' minutes')::INTERVAL)::TEXT
    ) STORED,

    -- Status and lifecycle
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN (
        'confirmed', 'pending', 'in-progress', 'completed', 'cancelled', 'no-show'
    )),

    -- Pricing and payment
    price INTEGER NOT NULL, -- Price in cents
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'refunded', 'failed'
    )),
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'online')),

    -- Notes and communication
    notes TEXT, -- Internal notes
    customer_notes TEXT, -- Customer notes
    reminder_sent BOOLEAN DEFAULT false,

    -- Audit fields
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(customer_id, appointment_date, start_time),
    CHECK (appointment_date >= CURRENT_DATE),
    CHECK (start_time ~ '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$') -- HH:MM format
);

-- =============================================================================
-- NOTIFICATIONS TABLE - Communication system
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    -- Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'appointment-reminder', 'appointment-confirmation', 'appointment-cancellation',
        'payment-receipt', 'marketing', 'system-alert', 'staff-notification'
    )),

    -- Recipients
    recipient_id UUID REFERENCES public.users(id),
    recipient_email TEXT,
    recipient_phone TEXT,

    -- Delivery channels and status
    channels JSONB DEFAULT '[]', -- Array of delivery attempts with status

    -- Scheduling
    status TEXT DEFAULT 'draft' CHECK (status IN (
        'draft', 'scheduled', 'sending', 'sent', 'failed'
    )),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,

    -- Relationships
    related_appointment_id UUID REFERENCES public.appointments(id),
    related_service_id UUID REFERENCES public.services(id),
    template_id UUID, -- For future template system

    -- Metadata
    metadata JSONB DEFAULT '{}',
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

    -- Audit
    sent_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SETTINGS TABLE - Application configuration
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'business', 'booking', 'payment', 'communication', 'system', 'loyalty'
    )),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    requires_restart BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- REVIEWS AND RATINGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,

    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT false,

    -- Response from staff/business
    response TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    response_by UUID REFERENCES public.users(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(customer_id, appointment_id)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);

-- Customers table indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty_tier ON public.customers(loyalty_tier);
CREATE INDEX IF NOT EXISTS idx_customers_last_visit ON public.customers(last_visit);
CREATE INDEX IF NOT EXISTS idx_customers_referral_code ON public.customers(referral_code);

-- Staff table indexes
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_active ON public.staff(is_active);

-- Appointments table indexes
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON public.appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON public.appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON public.appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON public.appointments(appointment_date, start_time);

-- Services table indexes
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_featured ON public.services(featured);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_for);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON public.reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_staff ON public.reviews(staff_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Staff can view customer data for their appointments
CREATE POLICY "Staff can view customer data" ON public.customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.staff s
            WHERE s.user_id = auth.uid()
            AND s.is_active = true
        )
    );

-- Customers can view their own data
CREATE POLICY "Customers can view own data" ON public.customers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Customers can update own data" ON public.customers
    FOR UPDATE USING (user_id = auth.uid());

-- Staff can view their appointments
CREATE POLICY "Staff can view their appointments" ON public.appointments
    FOR SELECT USING (staff_id IN (
        SELECT id FROM public.staff WHERE user_id = auth.uid()
    ));

-- Customers can view their appointments
CREATE POLICY "Customers can view their appointments" ON public.appointments
    FOR SELECT USING (customer_id IN (
        SELECT id FROM public.customers WHERE user_id = auth.uid()
    ));

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_already BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 8-character code
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));

        -- Check if it already exists
        SELECT EXISTS(
            SELECT 1 FROM public.customers
            WHERE referral_code = code
        ) INTO exists_already;

        EXIT WHEN NOT exists_already;
    END LOOP;

    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral codes
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_referral_code
    BEFORE INSERT ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_referral_code();

-- Function to calculate appointment end time
CREATE OR REPLACE FUNCTION calculate_end_time(start_time TEXT, duration_minutes INTEGER)
RETURNS TEXT AS $$
BEGIN
    RETURN (
        start_time::TIME + (duration_minutes || ' minutes')::INTERVAL
    )::TEXT;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- INITIAL DATA SEEDING
-- =============================================================================

-- Insert default admin user (password should be hashed in production)
INSERT INTO public.users (name, email, role, is_active)
VALUES ('Admin User', 'admin@modernmen.com', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert default settings
INSERT INTO public.settings (key, value, category, description) VALUES
('business_name', '"Modern Men Hair Salon"', 'business', 'Business name displayed throughout the application'),
('business_hours', '{
    "monday": {"open": "09:00", "close": "17:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "17:00", "closed": false},
    "thursday": {"open": "09:00", "close": "17:00", "closed": false},
    "friday": {"open": "09:00", "close": "17:00", "closed": false},
    "saturday": {"open": "09:00", "close": "17:00", "closed": false},
    "sunday": {"open": "09:00", "close": "17:00", "closed": true}
}', 'business', 'Business operating hours'),
('booking_settings', '{
    "max_advance_days": 30,
    "min_advance_hours": 2,
    "slot_duration": 30,
    "cancellation_hours": 24,
    "allow_same_day": true,
    "require_phone_verification": false
}', 'booking', 'Booking system configuration'),
('loyalty_settings', '{
    "enabled": true,
    "points_per_dollar": 1,
    "points_per_visit": 10,
    "referral_points": 50,
    "tiers": {
        "bronze": {"min_points": 0, "discount": 0},
        "silver": {"min_points": 100, "discount": 5},
        "gold": {"min_points": 500, "discount": 10},
        "platinum": {"min_points": 1000, "discount": 15}
    }
}', 'loyalty', 'Loyalty program configuration'),
('notification_settings', '{
    "email_reminder_hours": 24,
    "sms_reminder_hours": 2,
    "booking_confirmation": true,
    "appointment_reminder": true,
    "cancellation_notice": true,
    "payment_receipt": true
}', 'communication', 'Notification preferences and settings')
ON CONFLICT (key) DO NOTHING;

-- Insert sample services with preparation and aftercare instructions
INSERT INTO public.services (
  name,
  description,
  category,
  price,
  duration,
  is_active,
  preparation_instructions,
  aftercare_instructions
) VALUES
('Classic Haircut',
 'Traditional men''s haircut with precision styling',
 'haircuts',
 3500,
 30,
 true,
 '• Arrive 5-10 minutes early to complete paperwork
• Come with clean, dry hair if possible
• Wear comfortable clothing that won''t interfere with the service
• Bring reference photos if you have a specific style in mind',
 '• Wash hair within 24-48 hours to remove styling product residue
• Use gentle shampoo and conditioner suitable for your hair type
• Avoid excessive heat styling for 48 hours
• Schedule next appointment based on hair growth (typically 3-4 weeks)'),

('Beard Trim',
 'Professional beard grooming and shaping',
 'beard-grooming',
 2000,
 20,
 true,
 '• Arrive with a clean, dry beard
• Come freshly shaved if you want a complete beard trim
• Inform barber of any skin sensitivities or allergies
• Bring reference photos if you have a specific beard style in mind',
 '• Apply beard oil daily to keep beard soft and healthy
• Wash beard regularly with gentle cleanser
• Trim every 1-2 weeks to maintain shape
• Moisturize skin underneath beard to prevent irritation'),

('Haircut & Beard Combo',
 'Complete grooming package with haircut and beard trim',
 'packages',
 5000,
 45,
 true,
 '• Arrive 10 minutes early for extended consultation
• Come with clean, dry hair and beard
• Wear comfortable clothing
• Bring reference photos for both hair and beard styles
• Inform barber of any preferences for service order',
 '• Follow hair washing guidelines (24-48 hours)
• Apply beard oil daily and maintain regular trims
• Use appropriate hair products for your hair type
• Schedule next appointment when hair/beard growth requires maintenance'),

('Hair Color',
 'Professional hair coloring services',
 'hair-color',
 8000,
 90,
 true,
 '• Arrive with clean hair (washed 24 hours prior)
• Inform stylist of any allergies to hair products
• Discuss desired color and current hair condition
• Come prepared for extended service time (60-90 minutes)
• Bring reference photos of desired color',
 '• Wait 24 hours before washing colored hair
• Use color-safe shampoo and conditioner
• Avoid heat styling for 72 hours after coloring
• Use color-depositing products to maintain vibrancy
• Schedule maintenance appointments every 4-6 weeks'),

('Facial Treatment',
 'Deep cleansing facial for healthy skin',
 'facial-treatments',
 6000,
 60,
 true,
 '• Arrive with clean skin (no makeup)
• Inform therapist of skin conditions or allergies
• Come relaxed and prepared for a calming experience
• Remove contact lenses if applicable
• Discuss skin concerns and goals',
 '• Avoid touching face excessively for 24 hours
• Use gentle, fragrance-free skincare products
• Stay out of direct sun and use SPF
• Drink plenty of water to maintain skin hydration
• Schedule follow-up treatments every 4-6 weeks')
ON CONFLICT DO NOTHING;
