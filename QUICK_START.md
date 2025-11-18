# Quick Start Guide - Kari Healthcare Platform

## 🚀 Get Up and Running in 5 Minutes

This guide will help you get the Kari Healthcare Platform running on your local machine.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works great)
- Code editor (VS Code recommended)

## Step 1: Environment Setup (2 minutes)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to initialize (~2 minutes)

### 1.2 Get Your Credentials
1. Go to Project Settings → API
2. Copy:
   - `URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 Create Environment File
Create `.env.local` in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 2: Database Setup (3 minutes)

### 2.1 Run SQL Commands
1. Open Supabase SQL Editor
2. Open `DATABASE_SETUP.md` from this project
3. Copy and paste each section of SQL:
   - ✅ Section 1: Create Tables
   - ✅ Section 2: Enable RLS
   - ✅ Section 3: Create Policies
   - ✅ Section 4: Create Indexes
   - ✅ Section 5: Admin Function
4. Click "Run" for each section

### 2.2 Create Storage Bucket
1. Go to Storage in Supabase
2. Click "New bucket"
3. Name: `practitioner-files`
4. Make it **private** (not public)
5. Click "Create bucket"
6. Run the storage policies SQL from `DATABASE_SETUP.md`

## Step 3: Start Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 4: Create Your First Accounts

### Test as Patient
1. Go to `http://localhost:3000`
2. Click "Get Started as Patient"
3. Fill in the form
4. Sign up!
5. You'll be redirected to the patient dashboard

### Test as Practitioner
1. Go to `http://localhost:3000/practitioner-signup`
2. Complete the 3-step form:
   - Step 1: Account info
   - Step 2: Professional info
   - Step 3: Profile details (optional)
3. Click "Complete Registration"
4. You'll be redirected to practitioner dashboard

### Create Admin User
1. Sign up as a patient first
2. Go to Supabase → Authentication → Users
3. Copy the user ID
4. Go to SQL Editor
5. Run:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id-here';
```
6. Sign out and sign back in
7. You'll be redirected to admin panel

## Step 5: Test the Platform

### As Patient:
- ✅ Search for practitioners
- ✅ View practitioner profiles
- ✅ Book an appointment
- ✅ View your dashboard
- ✅ Cancel appointment

### As Practitioner:
- ✅ View your dashboard
- ✅ See today's schedule
- ✅ View appointment history
- ✅ Edit your profile
- ✅ Mark appointments as completed

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution:** Make sure `.env.local` exists and has all three variables set correctly.

### Issue: "Failed to create profile"
**Solution:** 
1. Check that RLS is enabled
2. Verify all policies are created
3. Check Supabase logs for errors

### Issue: "Can't upload profile picture"
**Solution:**
1. Verify storage bucket `practitioner-files` exists
2. Check storage policies are set up
3. Ensure bucket is private (not public)

### Issue: "No practitioners showing up"
**Solution:** You need to sign up at least one practitioner first!

### Issue: Database connection errors
**Solution:**
1. Verify `.env.local` URLs are correct
2. Check Supabase project is running
3. Verify you copied the anon key (not the service role key) for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## What Works Right Now

### ✅ Fully Functional
- User authentication (sign up, sign in, sign out)
- Role-based access control
- Patient dashboard with appointments
- Practitioner dashboard with stats
- Search and filter practitioners
- View practitioner profiles
- Book appointments
- Cancel appointments
- Manage practitioner profile
- View appointment history

### ⏳ To Be Completed
- Admin panel for user management
- AI health assistant chatbot
- Schedule management (placeholder page exists)

## Next Steps

1. **Add Sample Data:** Sign up a few practitioners with different specialties
2. **Test Booking:** Book appointments as a patient
3. **Explore Features:** Test all the features listed above
4. **Customize:** Update colors, copy, images to match your brand
5. **Deploy:** When ready, deploy to Vercel

## Need Help?

Check these files:
- `README.md` - Full project documentation
- `DATABASE_SETUP.md` - Detailed database setup
- `IMPLEMENTATION_STATUS.md` - What's complete and what's pending
- `WEBAPP_RECREATION_PROMPT.md` - Original requirements

## Deployment (When Ready)

### Deploy to Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (same as `.env.local`)
5. Click "Deploy"
6. Done!

### Update Supabase Settings
1. Go to Authentication → URL Configuration
2. Add your Vercel URL to "Site URL"
3. Add redirect URLs for auth callbacks

---

## 🎉 You're Ready!

Your Kari Healthcare Platform is now running locally. Start exploring the features and customizing it to your needs!

**Pro Tip:** Open two browser windows (or use incognito) to test patient and practitioner flows simultaneously.

Enjoy building your healthcare platform! 🏥

