# Supabase Connection Troubleshooting Guide

## Issue Fixed: "duplicate key value violates unique constraint 'profiles_pkey'"

### What Was the Problem?

When trying to create a patient account, you encountered a duplicate key error. This happened because:

1. A user with that email already existed in Supabase Auth
2. When `supabase.auth.signUp()` was called with an existing email, Supabase returned the existing user
3. The code then tried to create a profile for that user ID, which already existed
4. This caused the "duplicate key violates unique constraint" error

### What Was Fixed?

I've updated three files to check if a profile already exists before trying to create it:

1. **`components/auth/auth-provider.tsx`** - Patient sign-up
2. **`components/auth/practitioner-sign-up-form.tsx`** - Practitioner sign-up
3. **`app/api/admin/users/route.ts`** - Admin user creation

Now the code:
- Checks if a profile exists before inserting
- Only creates the profile if it doesn't already exist
- Prevents duplicate key errors

## Verify Your Supabase Connection

### Step 1: Check Environment Variables

Make sure you have a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**To get these values:**
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (click "Reveal" first)

### Step 2: Verify Database Tables Exist

Go to Supabase **SQL Editor** and run:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

You should see:
- `profiles`
- `practitioners`
- `appointments`
- `reviews`

**If tables are missing**, run the SQL commands from `DATABASE_SETUP.md`.

### Step 3: Check Row Level Security (RLS) Policies

Run this query to verify RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'practitioners', 'appointments', 'reviews');
```

All tables should have `rowsecurity = true`.

### Step 4: Test the Connection

Run this in Supabase SQL Editor:

```sql
SELECT * FROM profiles LIMIT 5;
```

If you get results (or "no rows" which is fine), the connection is working!

## Clean Up Duplicate/Test Users (If Needed)

If you've been testing and have duplicate or incomplete user records:

### Option 1: Delete Specific User

```sql
-- First, find the user ID
SELECT id, email FROM auth.users WHERE email = 'test@example.com';

-- Then delete (this will cascade to profiles and related tables)
DELETE FROM auth.users WHERE id = 'user-id-here';
```

### Option 2: Clean Up All Test Data

⚠️ **WARNING: This will delete ALL users except the one you specify**

```sql
-- Keep one admin user (replace with your admin user ID)
DELETE FROM auth.users 
WHERE id NOT IN ('your-admin-user-id-here');
```

## Testing Patient Sign-Up

After the fix, try creating a patient account:

1. Go to `http://localhost:3000/auth/sign-up`
2. Fill in the form:
   - Full Name: Test Patient
   - Email: patient@test.com
   - Password: test123
3. Click "Create Account"
4. You should be redirected to the dashboard

### If it still fails:

1. **Check browser console** (F12) for errors
2. **Check terminal** where Next.js is running for server errors
3. **Check Supabase logs**:
   - Go to your Supabase project
   - Click on **Logs** → **Auth**
   - Look for recent sign-up attempts

## Common Issues and Solutions

### Issue: "Missing Supabase environment variables"

**Solution:** Create `.env.local` file with your Supabase credentials (see Step 1)

### Issue: "Failed to fetch"

**Solutions:**
- Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check if your Supabase project is active (not paused)
- Restart your development server: `npm run dev`

### Issue: "Row Level Security policy violation"

**Solutions:**
- Verify RLS policies are set up correctly (see `DATABASE_SETUP.md` Section 3)
- Check if the policies allow INSERT for authenticated users:

```sql
-- This should show policies for profiles table
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Issue: User created but profile not created

**Solution:** This should no longer happen with the fix, but if it does:

```sql
-- Manually create a profile for an existing auth user
INSERT INTO profiles (id, full_name, role)
VALUES ('user-id-here', 'Full Name', 'patient');
```

## Restart After Changes

After making any changes to:
- `.env.local` file
- Database schema
- RLS policies

Always restart your development server:

```bash
# Press Ctrl+C to stop
# Then restart:
npm run dev
```

## Still Having Issues?

1. **Check Supabase Project Status**: Make sure your project isn't paused (free tier pauses after inactivity)
2. **Verify Auth Settings**: Go to **Authentication** → **Settings** in Supabase
   - Email confirmations should be configured
   - Check if "Enable email confirmations" is ON or OFF (affects sign-up behavior)
3. **Review Database Logs**: In Supabase, go to **Logs** → **Database** to see any SQL errors
4. **Test with curl**:

```bash
curl -X GET "https://your-project.supabase.co/rest/v1/profiles" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

This should return a JSON response (even if empty). If not, there's a connection issue.

## Next Steps

1. ✅ Fix applied - profiles check for existence before creation
2. ✅ Verify environment variables are set
3. ✅ Test patient sign-up
4. ✅ Test practitioner sign-up
5. ✅ Test creating appointments

You're all set! The duplicate key error should now be resolved.

