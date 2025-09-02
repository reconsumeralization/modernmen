# 🗄️ DATABASE SCHEMA RELATIONSHIPS

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA RELATIONSHIPS                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                               CUSTOMERS                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐                                                           │
│  │     CUSTOMER    │◄─────────────────────────────────────────────────────┐    │
│  │   (Primary)     │                                                     │    │
│  └─────────────────┘                                                     │    │
│          │                                                                │    │
│          │                                                                │    │
│          ▼                                                                │    │
│  ┌─────────────────┐                                                     │    │
│  │  APPOINTMENTS   │◄─────────────────────────────────────────────────────┘    │
│  │  (1-to-many)    │                                                            │
│  └─────────────────┘                                                            │
│          │                                                                       │
│          │                                                                       │
│          ▼                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   SERVICES      │  │    STYLISTS     │  │   TIME SLOTS    │                  │
│  │ (many-to-many)  │  │  (many-to-many) │  │ (availability)   │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│          │                        │                        │                     │
│          │                        │                        │                     │
│          └────────────────────────┼────────────────────────┘                     │
│                                   │                                              │
│                                   ▼                                              │
│                          ┌─────────────────┐                                     │
│                          │   STAFF TEAM     │                                     │
│                          │   (Employees)    │                                     │
│                          └─────────────────┘                                     │
│                                   │                                              │
│                                   ▼                                              │
│                          ┌─────────────────┐                                     │
│                          │  PAYROLL &      │                                     │
│                          │  COMMISSION     │                                     │
│                          └─────────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

RELATIONSHIPS: 1:1 │ 1:M │ M:M │ FK (Foreign Key) │ PK (Primary Key)
```

## 🏗️ Database Architecture Overview

### Core Entities
| Entity | Purpose | Key Fields | Relationships |
|--------|---------|------------|---------------|
| **Customers** | Client information | name, email, phone, preferences | 1:M Appointments |
| **Appointments** | Booking records | date, time, status, notes | M:1 Customer, M:1 Service, M:1 Stylist |
| **Services** | Available services | name, duration, price, category | M:M Appointments |
| **Stylists** | Staff members | name, specialties, schedule | M:M Appointments |
| **Time Slots** | Availability | date, time, stylist, status | 1:1 Appointment |

### Extended Entities
| Entity | Purpose | Key Fields | Relationships |
|--------|---------|------------|---------------|
| **Payments** | Transaction records | amount, method, status, date | 1:1 Appointment |
| **Reviews** | Customer feedback | rating, comment, date | 1:1 Appointment |
| **Loyalty** | Rewards program | points, tier, expiry | 1:1 Customer |
| **Communications** | Email/SMS logs | type, content, status | 1:1 Customer |

## 📊 Entity Relationship Diagram (ERD)

### Customer-Centric Relationships
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   CUSTOMERS     │       │  APPOINTMENTS   │       │   SERVICES      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────┤ customer_id (FK)│       │ id (PK)         │
│ first_name      │       │ service_id (FK) │──────►│ name            │
│ last_name       │       │ stylist_id (FK) │       │ duration        │
│ email           │       │ date            │       │ price           │
│ phone           │       │ time            │       │ category        │
│ date_created    │       │ status          │       │ description     │
│ preferences     │       │ notes           │       └─────────────────┘
└─────────────────┘       └─────────────────┘               ▲
          │                       │                       │
          │                       │                       │
          ▼                       ▼                       │
┌─────────────────┐       ┌─────────────────┐             │
│   LOYALTY       │       │   PAYMENTS      │             │
├─────────────────┤       ├─────────────────┤             │
│ customer_id (FK)│       │ appointment_id  │             │
│ points          │       │ amount          │             │
│ tier            │       │ method          │             │
│ expiry_date     │       │ status          │             │
│ date_created    │       │ transaction_id  │             │
└─────────────────┘       └─────────────────┘             │
                                                          │
┌─────────────────┐       ┌─────────────────┐             │
│   STYLISTS      │       │  TIME SLOTS     │             │
├─────────────────┤       ├─────────────────┤             │
│ id (PK)         │◄──────┤ stylist_id (FK) │             │
│ first_name      │       │ date            │             │
│ last_name       │       │ time            │             │
│ specialties     │       │ status          │             │
│ schedule        │       │ appointment_id  │◄────────────┘
│ commission_rate │       └─────────────────┘
└─────────────────┘
```

## 🔑 Primary Keys and Foreign Keys

### Primary Keys (PK)
```sql
-- Auto-incrementing integer IDs
customers.id: SERIAL PRIMARY KEY
appointments.id: SERIAL PRIMARY KEY
services.id: SERIAL PRIMARY KEY
stylists.id: SERIAL PRIMARY KEY
time_slots.id: SERIAL PRIMARY KEY
```

### Foreign Keys (FK)
```sql
-- Appointment relationships
appointments.customer_id: INTEGER REFERENCES customers(id)
appointments.service_id: INTEGER REFERENCES services(id)
appointments.stylist_id: INTEGER REFERENCES stylists(id)

-- Time slot relationships
time_slots.stylist_id: INTEGER REFERENCES stylists(id)
time_slots.appointment_id: INTEGER REFERENCES appointments(id) NULL

-- Loyalty relationships
loyalty.customer_id: INTEGER REFERENCES customers(id)

-- Payment relationships
payments.appointment_id: INTEGER REFERENCES appointments(id)
```

## 📈 Database Schema Design

### Customers Table
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  preferred_stylist_id INTEGER REFERENCES stylists(id),
  notes TEXT,
  preferences JSONB, -- Store preferences as JSON
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  stylist_id INTEGER NOT NULL REFERENCES stylists(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  internal_notes TEXT,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  UNIQUE(customer_id, appointment_date, appointment_time),
  CHECK (appointment_date >= CURRENT_DATE)
);
```

### Services Table
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stylists Table
```sql
CREATE TABLE stylists (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  specialties TEXT[], -- Array of specialties
  commission_percentage DECIMAL(5,2) DEFAULT 40.00,
  is_active BOOLEAN DEFAULT TRUE,
  hire_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Time Slots Table
```sql
CREATE TABLE time_slots (
  id SERIAL PRIMARY KEY,
  stylist_id INTEGER NOT NULL REFERENCES stylists(id),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status VARCHAR(20) DEFAULT 'available'
    CHECK (status IN ('available', 'booked', 'blocked', 'maintenance')),
  appointment_id INTEGER REFERENCES appointments(id) NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Ensure one slot per stylist per time
  UNIQUE(stylist_id, slot_date, slot_time)
);
```

## 🔗 Advanced Relationships

### Many-to-Many: Appointments ↔ Services (through appointment_services)
```sql
CREATE TABLE appointment_services (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  notes TEXT,

  UNIQUE(appointment_id, service_id)
);
```

### Many-to-Many: Stylists ↔ Specialties (through stylist_specialties)
```sql
CREATE TABLE stylist_specialties (
  id SERIAL PRIMARY KEY,
  stylist_id INTEGER NOT NULL REFERENCES stylists(id),
  specialty_name VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(20) DEFAULT 'intermediate'
    CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),

  UNIQUE(stylist_id, specialty_name)
);
```

### Self-Referencing: Employee Hierarchy
```sql
ALTER TABLE stylists
ADD COLUMN manager_id INTEGER REFERENCES stylists(id) NULL;
```

## 📊 Database Indexes

### Performance Indexes
```sql
-- Customer lookups
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_name ON customers(first_name, last_name);

-- Appointment queries
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_stylist_date ON appointments(stylist_id, appointment_date);

-- Time slot queries
CREATE INDEX idx_time_slots_stylist_date ON time_slots(stylist_id, slot_date);
CREATE INDEX idx_time_slots_status ON time_slots(status);
CREATE INDEX idx_time_slots_date_time ON time_slots(slot_date, slot_time);

-- Service queries
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active);
```

## 🔒 Database Constraints

### Check Constraints
```sql
-- Appointment status validation
ALTER TABLE appointments
ADD CONSTRAINT chk_appointment_status
CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed', 'no_show'));

-- Time slot status validation
ALTER TABLE time_slots
ADD CONSTRAINT chk_time_slot_status
CHECK (status IN ('available', 'booked', 'blocked', 'maintenance'));

-- Commission percentage validation
ALTER TABLE stylists
ADD CONSTRAINT chk_commission_percentage
CHECK (commission_percentage >= 0 AND commission_percentage <= 100);
```

### Foreign Key Constraints
```sql
-- Cascade delete for related records
ALTER TABLE appointments
DROP CONSTRAINT appointments_customer_id_fkey,
ADD CONSTRAINT appointments_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT;

-- Set null for optional relationships
ALTER TABLE time_slots
DROP CONSTRAINT time_slots_appointment_id_fkey,
ADD CONSTRAINT time_slots_appointment_id_fkey
FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL;
```

## 🚀 Database Optimization

### Partitioning Strategy
```sql
-- Partition appointments by year for better performance
CREATE TABLE appointments_y2024 PARTITION OF appointments
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE appointments_y2025 PARTITION OF appointments
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### Materialized Views
```sql
-- Daily appointment summary
CREATE MATERIALIZED VIEW daily_appointment_summary AS
SELECT
  DATE_TRUNC('day', appointment_date) AS date,
  COUNT(*) AS total_appointments,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_appointments,
  SUM(total_price) AS total_revenue
FROM appointments
WHERE appointment_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', appointment_date)
ORDER BY date DESC;

-- Refresh daily
CREATE INDEX idx_daily_summary_date ON daily_appointment_summary(date);
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_appointment_summary;
```

### Database Triggers
```sql
-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📋 Database Migration Strategy

### Version Control for Schema
```sql
-- Migration files structure
migrations/
├── 001_initial_schema.sql
├── 002_add_loyalty_system.sql
├── 003_add_communication_log.sql
├── 004_add_payment_integration.sql
└── 005_performance_indexes.sql
```

### Rollback Strategy
```sql
-- Migration with rollback
BEGIN;
  -- Apply changes
  ALTER TABLE customers ADD COLUMN marketing_consent BOOLEAN DEFAULT FALSE;

  -- Verify no data corruption
  SELECT COUNT(*) FROM customers WHERE marketing_consent IS NULL;

  -- If verification passes, commit
  COMMIT;
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback on error
    ROLLBACK;
    RAISE;
END;
```

## 🔧 Database Maintenance

### Regular Maintenance Tasks
```sql
-- Analyze tables for query optimization
ANALYZE customers, appointments, services, stylists;

-- Vacuum for space reclamation
VACUUM (VERBOSE, ANALYZE) appointments;

-- Reindex heavily used indexes
REINDEX INDEX CONCURRENTLY idx_appointments_date_time;

-- Archive old data
CREATE TABLE appointments_archive AS
SELECT * FROM appointments
WHERE appointment_date < CURRENT_DATE - INTERVAL '2 years';
```

### Monitoring Queries
```sql
-- Slow query log analysis
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Table size monitoring
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
