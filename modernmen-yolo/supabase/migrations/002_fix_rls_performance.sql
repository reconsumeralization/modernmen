-- Fix RLS Performance Issues
-- This migration addresses auth_rls_initplan warnings by optimizing RLS policies
-- to avoid unnecessary re-evaluation of auth functions for each row

-- =====================================================
-- CUSTOMERS TABLE RLS FIXES
-- =====================================================

-- Drop existing inefficient policies
DROP POLICY IF EXISTS "customers_insert_own" ON customers;
DROP POLICY IF EXISTS "customers_select_own_or_staff" ON customers;
DROP POLICY IF EXISTS "customers_update_own_or_staff" ON customers;

-- Create optimized policies with SELECT subqueries
CREATE POLICY "customers_insert_own" ON customers
FOR INSERT WITH CHECK (
  (select auth.uid()) = user_id
);

CREATE POLICY "customers_select_own_or_staff" ON customers
FOR SELECT USING (
  (select auth.uid()) = user_id OR
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role IN ('admin', 'manager')
  )
);

CREATE POLICY "customers_update_own_or_staff" ON customers
FOR UPDATE USING (
  (select auth.uid()) = user_id OR
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role IN ('admin', 'manager')
  )
);

-- =====================================================
-- PROFILES TABLE RLS FIXES
-- =====================================================

-- Drop existing inefficient policies
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- Create optimized policies
CREATE POLICY "profiles_select_own" ON profiles
FOR SELECT USING (
  (select auth.uid()) = user_id
);

CREATE POLICY "profiles_insert_own" ON profiles
FOR INSERT WITH CHECK (
  (select auth.uid()) = user_id
);

CREATE POLICY "profiles_update_own" ON profiles
FOR UPDATE USING (
  (select auth.uid()) = user_id
);

-- =====================================================
-- SERVICES TABLE RLS FIXES
-- =====================================================

-- Drop existing inefficient policies
DROP POLICY IF EXISTS "services_insert_admin" ON services;
DROP POLICY IF EXISTS "services_update_admin" ON services;

-- Create optimized policies
CREATE POLICY "services_insert_admin" ON services
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role = 'admin'
  )
);

CREATE POLICY "services_update_admin" ON services
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role = 'admin'
  )
);

-- =====================================================
-- STAFF TABLE RLS FIXES
-- =====================================================

-- Drop existing inefficient policies
DROP POLICY IF EXISTS "staff_select_all" ON staff;
DROP POLICY IF EXISTS "staff_insert_admin" ON staff;
DROP POLICY IF EXISTS "staff_update_own_or_admin" ON staff;

-- Create optimized policies
CREATE POLICY "staff_select_all" ON staff
FOR SELECT USING (
  (select auth.uid()) = user_id OR
  EXISTS (
    SELECT 1 FROM staff s
    WHERE s.user_id = (select auth.uid())
    AND s.role = 'admin'
  )
);

CREATE POLICY "staff_insert_admin" ON staff
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role = 'admin'
  )
);

CREATE POLICY "staff_update_own_or_admin" ON staff
FOR UPDATE USING (
  (select auth.uid()) = user_id OR
  EXISTS (
    SELECT 1 FROM staff s
    WHERE s.user_id = (select auth.uid())
    AND s.role = 'admin'
  )
);

-- =====================================================
-- APPOINTMENTS TABLE RLS FIXES
-- =====================================================

-- Drop existing inefficient policies
DROP POLICY IF EXISTS "appointments_select_related" ON appointments;
DROP POLICY IF EXISTS "appointments_insert_staff_or_customer" ON appointments;
DROP POLICY IF EXISTS "appointments_update_staff" ON appointments;

-- Create optimized policies
CREATE POLICY "appointments_select_related" ON appointments
FOR SELECT USING (
  (select auth.uid()) = customer_id OR
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
  ) OR
  EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.id = appointments.id
    AND a.staff_id IN (
      SELECT s.id FROM staff s
      WHERE s.user_id = (select auth.uid())
    )
  )
);

CREATE POLICY "appointments_insert_staff_or_customer" ON appointments
FOR INSERT WITH CHECK (
  (select auth.uid()) = customer_id OR
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
  )
);

CREATE POLICY "appointments_update_staff" ON appointments
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
  )
);

-- =====================================================
-- TIME_ENTRIES TABLE RLS FIXES
-- =====================================================

-- Drop existing inefficient policies
DROP POLICY IF EXISTS "time_entries_select_own_or_admin" ON time_entries;
DROP POLICY IF EXISTS "time_entries_insert_own" ON time_entries;
DROP POLICY IF EXISTS "time_entries_update_own_or_admin" ON time_entries;

-- Create optimized policies
CREATE POLICY "time_entries_select_own_or_admin" ON time_entries
FOR SELECT USING (
  (select auth.uid()) = staff_id OR
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role = 'admin'
  )
);

CREATE POLICY "time_entries_insert_own" ON time_entries
FOR INSERT WITH CHECK (
  (select auth.uid()) = staff_id
);

CREATE POLICY "time_entries_update_own_or_admin" ON time_entries
FOR UPDATE USING (
  (select auth.uid()) = staff_id OR
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role = 'admin'
  )
);

-- =====================================================
-- PAYROLL TABLE RLS FIXES
-- =====================================================

-- Drop existing inefficient policies
DROP POLICY IF EXISTS "payroll_select_own_or_admin" ON payroll;
DROP POLICY IF EXISTS "payroll_insert_admin" ON payroll;
DROP POLICY IF EXISTS "payroll_update_admin" ON payroll;

-- Create optimized policies
CREATE POLICY "payroll_select_own_or_admin" ON payroll
FOR SELECT USING (
  (select auth.uid()) = staff_id OR
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role = 'admin'
  )
);

CREATE POLICY "payroll_insert_admin" ON payroll
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role = 'admin'
  )
);

CREATE POLICY "payroll_update_admin" ON payroll
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = (select auth.uid())
    AND staff.role = 'admin'
  )
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Add comments for verification
COMMENT ON POLICY "customers_insert_own" ON customers IS 'Optimized RLS policy using SELECT subquery to avoid auth function re-evaluation';
COMMENT ON POLICY "profiles_select_own" ON profiles IS 'Optimized RLS policy using SELECT subquery to avoid auth function re-evaluation';
COMMENT ON POLICY "staff_select_all" ON staff IS 'Optimized RLS policy using SELECT subquery to avoid auth function re-evaluation';
COMMENT ON POLICY "appointments_select_related" ON appointments IS 'Optimized RLS policy using SELECT subquery to avoid auth function re-evaluation';

-- Performance improvement verification query
-- This can be run after deployment to verify the optimization
/*
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
*/
