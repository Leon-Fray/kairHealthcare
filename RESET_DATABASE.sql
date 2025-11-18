-- ============================================
-- Kari Healthcare Platform - Database Reset Script
-- ============================================
-- This script will completely reset and recreate the database schema
-- WARNING: This will delete ALL data in the following tables:
--   - reviews
--   - appointments
--   - practitioners
--   - profiles
-- ============================================

-- Step 1: Drop all RLS Policies
-- ============================================

-- Drop profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can do anything with profiles" ON profiles;

-- Drop practitioners policies
DROP POLICY IF EXISTS "Practitioners are viewable by everyone" ON practitioners;
DROP POLICY IF EXISTS "Practitioners can insert their own record" ON practitioners;
DROP POLICY IF EXISTS "Practitioners can update own record" ON practitioners;

-- Drop appointments policies
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;

-- Drop reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;

-- Step 2: Drop all Indexes
-- ============================================

DROP INDEX IF EXISTS idx_profiles_role;
DROP INDEX IF EXISTS idx_practitioners_specialty;
DROP INDEX IF EXISTS idx_appointments_patient_id;
DROP INDEX IF EXISTS idx_appointments_practitioner_id;
DROP INDEX IF EXISTS idx_appointments_start_time;
DROP INDEX IF EXISTS idx_reviews_practitioner_id;

-- Step 3: Drop all Functions
-- ============================================

DROP FUNCTION IF EXISTS public.is_authenticated_admin();

-- Step 4: Drop all Tables (in reverse dependency order)
-- ============================================

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS practitioners CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 5: Recreate Tables
-- ============================================

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'practitioner', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practitioners table
CREATE TABLE practitioners (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialty TEXT NOT NULL,
  credentials TEXT,
  consultation_types TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  profile_picture_url TEXT,
  id_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  practitioner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  practitioner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS Policies
-- ============================================

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Practitioners policies
CREATE POLICY "Practitioners are viewable by everyone"
  ON practitioners FOR SELECT USING (true);

CREATE POLICY "Practitioners can insert their own record"
  ON practitioners FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Practitioners can update own record"
  ON practitioners FOR UPDATE USING (auth.uid() = id);

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Step 8: Create Indexes
-- ============================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_practitioners_specialty ON practitioners(specialty);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_practitioner_id ON appointments(practitioner_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_reviews_practitioner_id ON reviews(practitioner_id);

-- Step 9: Create Admin Helper Function
-- ============================================

CREATE OR REPLACE FUNCTION public.is_authenticated_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_authenticated_admin() TO anon, authenticated;

-- Admin policy
CREATE POLICY "Admins can do anything with profiles"
  ON profiles
  USING (public.is_authenticated_admin())
  WITH CHECK (public.is_authenticated_admin());

-- ============================================
-- Reset Complete!
-- ============================================
-- All tables, policies, indexes, and functions have been reset
-- The database schema is now fresh and ready to use
-- ============================================

