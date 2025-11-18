# Database Setup Guide

This guide will help you set up the Supabase database for the Kari Healthcare Platform.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys to `.env.local`

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Schema

Run the following SQL commands in your Supabase SQL Editor:

### 1. Create Tables

```sql
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
```

### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

### 3. Create RLS Policies

```sql
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
```

### 4. Create Indexes

```sql
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_practitioners_specialty ON practitioners(specialty);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_practitioner_id ON appointments(practitioner_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_reviews_practitioner_id ON reviews(practitioner_id);
```

### 5. Create Admin Helper Function

```sql
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
```

## Storage Setup

### Create Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `practitioner-files`
3. Set it to **private** (not public)
4. Create the following folders:
   - `profile-pictures/`
   - `id-verification/`

### Storage Policies

Run these SQL commands to set up storage policies:

```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'practitioner-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own files
CREATE POLICY "Users can read their own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'practitioner-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to profile pictures
CREATE POLICY "Public can view profile pictures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'practitioner-files' AND (storage.foldername(name))[1] = 'profile-pictures');
```

## Initial Admin User

To create an admin user, first create a regular account through the sign-up form, then run this SQL in Supabase SQL Editor:

```sql
-- Replace 'user_id_here' with the actual user ID from auth.users table
UPDATE profiles SET role = 'admin' WHERE id = 'user_id_here';
```

## Verify Setup

Run this query to verify your setup:

```sql
SELECT 
  (SELECT COUNT(*) FROM profiles) as profile_count,
  (SELECT COUNT(*) FROM practitioners) as practitioner_count,
  (SELECT COUNT(*) FROM appointments) as appointment_count,
  (SELECT COUNT(*) FROM reviews) as review_count;
```

## Troubleshooting

### Can't create profiles

- Ensure RLS is enabled
- Check that policies are created correctly
- Verify the user is authenticated

### Can't upload files

- Check storage bucket exists
- Verify storage policies are set up
- Ensure file size is under 5MB

### Can't see practitioner data

- Ensure you're querying with proper joins
- Check RLS policies on practitioners table
- Verify practitioner record was created after profile

## Next Steps

After setting up the database:

1. Test sign up as a patient
2. Test sign up as a practitioner
3. Create an admin user
4. Test creating appointments
5. Test file uploads for practitioner profiles

