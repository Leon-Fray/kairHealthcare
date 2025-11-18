-- ============================================
-- Create Test Users in auth.users
-- ============================================
-- WARNING: This script may not work in all Supabase setups
-- Direct insertion into auth.users requires specific permissions and extensions
-- 
-- RECOMMENDED: Use the Node.js script (create-test-users.js) instead
-- which uses the Supabase Admin API - this is more reliable
-- ============================================
-- 
-- If you want to try this SQL approach:
-- 1. Make sure pgcrypto extension is enabled: CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- 2. You need admin/database owner permissions
-- 3. Run this BEFORE importing the CSV files
-- ============================================

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Patients
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  '00000000-0000-0000-0000-000000000000',
  'john.smith@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-15 10:00:00+00',
  '2024-01-15 10:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000',
  'sarah.johnson@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-16 11:00:00+00',
  '2024-01-16 11:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  '00000000-0000-0000-0000-000000000000',
  'michael.chen@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-17 12:00:00+00',
  '2024-01-17 12:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  '00000000-0000-0000-0000-000000000000',
  'emily.davis@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-18 13:00:00+00',
  '2024-01-18 13:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  '00000000-0000-0000-0000-000000000000',
  'david.wilson@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-19 14:00:00+00',
  '2024-01-19 14:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
-- Practitioners
(
  '550e8400-e29b-41d4-a716-446655440010',
  '00000000-0000-0000-0000-000000000000',
  'dr.anderson@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-10 09:00:00+00',
  '2024-01-10 09:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  '00000000-0000-0000-0000-000000000000',
  'dr.garcia@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-11 09:30:00+00',
  '2024-01-11 09:30:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  '00000000-0000-0000-0000-000000000000',
  'dr.taylor@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-12 10:00:00+00',
  '2024-01-12 10:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440013',
  '00000000-0000-0000-0000-000000000000',
  'dr.brown@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-13 10:30:00+00',
  '2024-01-13 10:30:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440014',
  '00000000-0000-0000-0000-000000000000',
  'dr.martinez@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-14 11:00:00+00',
  '2024-01-14 11:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
-- Admin
(
  '550e8400-e29b-41d4-a716-446655440020',
  '00000000-0000-0000-0000-000000000000',
  'admin@test.com',
  crypt('TestPassword123!', gen_salt('bf')),
  NOW(),
  '2024-01-01 08:00:00+00',
  '2024-01-01 08:00:00+00',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- Also insert into auth.identities for email authentication
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at
) VALUES
('550e8400-e29b-41d4-a716-446655440000-identity', '550e8400-e29b-41d4-a716-446655440000', '{"sub":"550e8400-e29b-41d4-a716-446655440000","email":"john.smith@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440000', '2024-01-15 10:00:00+00', '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440001-identity', '550e8400-e29b-41d4-a716-446655440001', '{"sub":"550e8400-e29b-41d4-a716-446655440001","email":"sarah.johnson@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440001', '2024-01-16 11:00:00+00', '2024-01-16 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002-identity', '550e8400-e29b-41d4-a716-446655440002', '{"sub":"550e8400-e29b-41d4-a716-446655440002","email":"michael.chen@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440002', '2024-01-17 12:00:00+00', '2024-01-17 12:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003-identity', '550e8400-e29b-41d4-a716-446655440003', '{"sub":"550e8400-e29b-41d4-a716-446655440003","email":"emily.davis@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440003', '2024-01-18 13:00:00+00', '2024-01-18 13:00:00+00'),
('550e8400-e29b-41d4-a716-446655440004-identity', '550e8400-e29b-41d4-a716-446655440004', '{"sub":"550e8400-e29b-41d4-a716-446655440004","email":"david.wilson@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440004', '2024-01-19 14:00:00+00', '2024-01-19 14:00:00+00'),
('550e8400-e29b-41d4-a716-446655440010-identity', '550e8400-e29b-41d4-a716-446655440010', '{"sub":"550e8400-e29b-41d4-a716-446655440010","email":"dr.anderson@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440010', '2024-01-10 09:00:00+00', '2024-01-10 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440011-identity', '550e8400-e29b-41d4-a716-446655440011', '{"sub":"550e8400-e29b-41d4-a716-446655440011","email":"dr.garcia@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440011', '2024-01-11 09:30:00+00', '2024-01-11 09:30:00+00'),
('550e8400-e29b-41d4-a716-446655440012-identity', '550e8400-e29b-41d4-a716-446655440012', '{"sub":"550e8400-e29b-41d4-a716-446655440012","email":"dr.taylor@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440012', '2024-01-12 10:00:00+00', '2024-01-12 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440013-identity', '550e8400-e29b-41d4-a716-446655440013', '{"sub":"550e8400-e29b-41d4-a716-446655440013","email":"dr.brown@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440013', '2024-01-13 10:30:00+00', '2024-01-13 10:30:00+00'),
('550e8400-e29b-41d4-a716-446655440014-identity', '550e8400-e29b-41d4-a716-446655440014', '{"sub":"550e8400-e29b-41d4-a716-446655440014","email":"dr.martinez@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440014', '2024-01-14 11:00:00+00', '2024-01-14 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440020-identity', '550e8400-e29b-41d4-a716-446655440020', '{"sub":"550e8400-e29b-41d4-a716-446655440020","email":"admin@test.com"}', 'email', '550e8400-e29b-41d4-a716-446655440020', '2024-01-01 08:00:00+00', '2024-01-01 08:00:00+00')
ON CONFLICT (id) DO NOTHING;

