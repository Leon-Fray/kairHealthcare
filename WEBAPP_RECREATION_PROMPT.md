# Complete Healthcare Booking Platform Recreation Guide

## 🎯 Project Overview

Create a full-stack healthcare booking platform called **Kari Healthcare Platform** that connects patients with healthcare practitioners. The platform features user authentication, practitioner search and discovery, appointment booking, role-based dashboards, an AI-powered health assistant chatbot, and comprehensive admin management.

---

## 🛠️ Technology Stack

### Core Framework & Language
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 18+

### Frontend Libraries
```json
{
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-popover": "^1.0.7",
  "@radix-ui/react-radio-group": "^1.1.3",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-tabs": "^1.0.4",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "date-fns": "^2.30.0",
  "lucide-react": "^0.294.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "tailwind-merge": "^2.0.0"
}
```

### Styling
- **CSS Framework**: Tailwind CSS 3.3+
- **Component Library**: Shadcn UI (based on Radix UI)
- **Font**: Inter (Google Fonts)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes

---

## 🎨 Design System

### Color Palette

**Primary Color**: Green (#059669) - Healthcare & wellness theme
- Primary: `hsl(142 76% 36%)` - Main green
- Secondary Patient: `hsl(182 73% 41%)` - Cyan/teal (#1cabb0)
- Secondary Doctor: `hsl(88 50% 50%)` - Lime green (#8cc342)

**Theme Structure**:
```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 142 76% 36%; /* Green primary */
--secondary-patient: 182 73% 41%; /* #1cabb0 */
--secondary-doctor: 88 50% 50%; /* #8cc342 */
--border: 214.3 31.8% 91.4%;
--radius: 0.75rem; /* Soft rounded corners */
```

### Design Elements & Animations

1. **Leaf Theme**: Subtle nature-inspired healthcare theme
   - Leaf icons as decorative elements
   - Leaf-sway animation (gentle rotation)
   - Leaf pattern backgrounds using radial gradients

2. **Background Patterns**:
   - `.bg-leaf-pattern`: Subtle green radial gradient circles
   - `.bg-gradient-green`: Linear gradient for sections
   - Leafy vines SVG pattern overlay

3. **Card Styling**:
   - `.card-enhanced`: Hover effects with lift and border color change
   - `.practitioner-card-accent`: Green top border accent
   - Rounded corners (0.75rem default)
   - Shadow transitions on hover

4. **Animations**:
   - `leaf-sway`: 3s gentle rotation animation
   - `leaf-glow`: 2s box-shadow pulse
   - `leaf-spin`: 1s rotation for loading states
   - Smooth transitions: `cubic-bezier(0.4, 0, 0.2, 1)`

5. **Section Dividers**:
   - Gradient lines with center accent
   - Green color with opacity gradients
   - Subtle leaf shapes in divider

### Typography
- **Font Family**: Inter (sans-serif)
- **Headings**: Bold, tracking-tight
- **Body**: Regular weight, good line-height
- **Colors**: foreground, muted-foreground for hierarchy

### Logo System
- **Patient Context**: Patient icon (Patients_Icon.png)
- **Practitioner Context**: Doctor icon (Doctors_icon.png)
- Images are 192x192px, displayed at h-48 w-48

---

## 📂 Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Home/Landing page
│   ├── layout.tsx                    # Root layout with providers
│   ├── globals.css                   # Global styles & theme
│   │
│   ├── auth/                         # Authentication pages
│   │   ├── sign-in/page.tsx         # Sign in page
│   │   └── sign-up/page.tsx         # Patient sign up page
│   │
│   ├── practitioner-signup/          # Practitioner registration
│   │   └── page.tsx                  # Multi-step practitioner signup
│   │
│   ├── dashboard/                    # Patient dashboard
│   │   └── page.tsx                  # Protected patient dashboard
│   │
│   ├── practitioner/                 # Practitioner section
│   │   ├── dashboard/page.tsx       # Practitioner dashboard
│   │   ├── schedule/page.tsx        # Manage schedule
│   │   ├── appointment-history/page.tsx  # View past appointments
│   │   ├── edit-account/page.tsx    # Edit practitioner profile
│   │   └── [id]/page.tsx            # Public practitioner profile
│   │
│   ├── search/                       # Search practitioners
│   │   └── page.tsx                  # Search with filters
│   │
│   ├── booking/                      # Appointment booking
│   │   ├── [practitionerId]/page.tsx # Book appointment form
│   │   └── confirmation/page.tsx     # Booking confirmation
│   │
│   ├── admin/                        # Admin section
│   │   ├── page.tsx                  # Admin landing
│   │   └── users/page.tsx            # User management
│   │
│   ├── api/                          # API routes
│   │   ├── chat/route.ts            # Chatbot AI endpoint
│   │   ├── seed-users/route.ts      # Database seeding
│   │   └── admin/
│   │       └── users/route.ts       # Admin user management API
│   │
│   └── middleware.ts                 # Route protection
│
├── components/                       # React components
│   ├── auth/                        # Authentication components
│   │   ├── auth-provider.tsx       # Global auth context
│   │   ├── sign-in-form.tsx        # Sign in form
│   │   ├── sign-up-form.tsx        # Patient signup form
│   │   ├── practitioner-sign-up-form.tsx  # Multi-step practitioner form
│   │   └── protected-route.tsx     # Route protection wrapper
│   │
│   ├── layout/                      # Layout components
│   │   ├── header.tsx              # Main navigation header
│   │   └── main-layout.tsx         # Page layout wrapper
│   │
│   ├── home/                        # Homepage components
│   │   ├── featured-practitioners.tsx  # Featured doctors
│   │   ├── healthcare-illustration.tsx # Hero illustration
│   │   └── how-it-works.tsx        # 3-step process section
│   │
│   ├── search/                      # Search components
│   │   ├── search-card.tsx         # Homepage search card
│   │   ├── search-filters.tsx      # Filter sidebar
│   │   └── search-results.tsx      # Results grid
│   │
│   ├── dashboard/                   # Dashboard components
│   │   ├── patient-dashboard.tsx   # Patient dashboard content
│   │   └── practitioner-dashboard.tsx  # Practitioner dashboard content
│   │
│   ├── chatbot/                     # AI Health Assistant
│   │   ├── health-assistant.tsx    # Chat interface
│   │   └── chatbot-wrapper.tsx     # Floating chat button
│   │
│   ├── admin/                       # Admin components
│   │   ├── user-management-table.tsx  # Users table
│   │   └── create-user-modal.tsx   # User creation modal
│   │
│   ├── theme/                       # Theme components
│   │   └── theme-provider.tsx      # Theme context
│   │
│   └── ui/                          # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── alert.tsx
│       ├── tabs.tsx
│       ├── table.tsx
│       ├── checkbox.tsx
│       ├── radio-group.tsx
│       └── file-upload.tsx
│
├── lib/                             # Utility functions
│   ├── database.ts                 # Supabase queries
│   ├── supabaseClient.ts          # Supabase client setup
│   ├── utils.ts                    # Helper functions (cn, etc.)
│   └── storage.ts                  # File upload utilities
│
├── data/                            # Static data
│   └── dialogue-map.json           # Chatbot knowledge base
│
└── types/                           # TypeScript types
    └── dialogue-map.ts             # Chatbot types

icons/
├── Doctors_icon.png                # Practitioner logo
└── Patients_Icon.png               # Patient logo
```

---

## 🗄️ Database Schema

### Supabase Tables

#### 1. `profiles` Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'practitioner', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### 2. `practitioners` Table
```sql
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

-- Enable RLS
ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Practitioners are viewable by everyone"
  ON practitioners FOR SELECT USING (true);

CREATE POLICY "Practitioners can insert their own record"
  ON practitioners FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Practitioners can update own record"
  ON practitioners FOR UPDATE USING (auth.uid() = id);
```

#### 3. `appointments` Table
```sql
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

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);
```

#### 4. `reviews` Table
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  practitioner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = patient_id);
```

#### Indexes for Performance
```sql
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_practitioners_specialty ON practitioners(specialty);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_practitioner_id ON appointments(practitioner_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_reviews_practitioner_id ON reviews(practitioner_id);
```

### Admin Helper Function
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

---

## 🔐 Authentication System

### Auth Provider Setup
Create a React Context (`auth-provider.tsx`) that:
- Wraps the entire application in `layout.tsx`
- Provides global auth state: `{ user, profile, loading, signIn, signUp, signOut }`
- Listens to Supabase auth state changes
- Fetches and caches user profile from `profiles` table
- Handles session persistence with localStorage

### Protected Routes
Component (`protected-route.tsx`) that:
- Accepts `requiredRole` prop: 'patient', 'practitioner', or 'admin'
- Shows loading state while checking auth
- Redirects to `/auth/sign-in` if not authenticated
- Redirects to appropriate dashboard if wrong role
- Renders children if authorized

### Sign Up Flow
1. **Patient Signup** (`/auth/sign-up`):
   - Collect: Full Name, Email, Password
   - Create auth user with Supabase Auth
   - Create profile record with role='patient'
   - Redirect to `/dashboard`

2. **Practitioner Signup** (`/practitioner-signup`):
   - **Step 1**: Basic Info (Full Name, Email, Password)
   - **Step 2**: Professional Info (Specialty, Credentials, Consultation Types)
   - **Step 3**: Additional Details (Bio, Profile Picture, ID Verification)
   - Create auth user
   - Create profile with role='practitioner'
   - Create practitioner record
   - Redirect to `/practitioner/dashboard`

### Sign In
- Simple email/password form
- Use Supabase Auth signInWithPassword
- Redirect based on user role:
  - Patient → `/dashboard`
  - Practitioner → `/practitioner/dashboard`
  - Admin → `/admin/users`

---

## 📄 Pages & Features (Detailed)

### 1. Homepage (`/`)

**Layout**:
- Header with logo and navigation
- Hero section with headline and healthcare illustration
- Search card component (prominent)
- How It Works section (3 steps with cards)
- Featured Practitioners grid
- Leaf pattern background

**Content**:
- Headline: "Find Your **Perfect Healthcare Match**"
- Subheading: "Connect with qualified healthcare professionals and book appointments that fit your schedule."
- Search card with fields: Specialty (select), Date (date picker), Location
- How It Works steps:
  1. "Find Your Practitioner" - Search by specialty
  2. "Book Your Appointment" - Choose time slots
  3. "Connect & Get Care" - Virtual or in-person
- Featured practitioners from database

**Behavior**:
- If user logged in → redirect to their dashboard
- Anonymous users see full landing page
- Search card redirects to `/search` with query params

### 2. Sign Up Page (`/auth/sign-up`)

**Layout**:
- Centered card with form
- Clean, minimal design
- Link to sign in

**Form Fields**:
- Full Name (text input, required)
- Email (email input, required)
- Password (password input, min 6 chars, required)
- Submit button: "Create Account"

**Validation**:
- Client-side validation for required fields
- Email format validation
- Password strength indicator
- Error messages display below form

**Success Flow**:
- Create user in Supabase Auth
- Create profile record in `profiles` table
- Auto-login
- Redirect to `/dashboard`

### 3. Practitioner Signup (`/practitioner-signup`)

**Multi-Step Form**:

**Step 1 - Account Information**:
- Full Name
- Email
- Password
- Confirm Password

**Step 2 - Professional Information**:
- Specialty (select): General Practice, Cardiology, Dermatology, Neurology, Orthopedics, Pediatrics, Psychiatry, etc.
- Credentials (text): e.g., "MD, Board Certified"
- Consultation Types (checkbox group):
  - ☐ Virtual Consultation
  - ☐ In-Person Visit
  - ☐ Home Visit

**Step 3 - Profile Details**:
- Bio (textarea): Professional summary
- Profile Picture (file upload): Image upload to Supabase Storage
- ID Verification Document (file upload): For credential verification
- Terms & Conditions (checkbox)

**UI Elements**:
- Progress indicator (Step 1/3, Step 2/3, Step 3/3)
- Back/Next navigation buttons
- Form state persists across steps
- Loading state during submission

### 4. Search Page (`/search`)

**Layout**:
- Two-column: Filters sidebar (1/4) + Results grid (3/4)
- Responsive: Stack on mobile

**Filter Sidebar** (SearchFilters component):
- **Specialty** (select dropdown)
- **Consultation Type** (radio group):
  - All Types
  - Virtual Only
  - In-Person Only
- **Date** (date picker): Filter by availability
- **Rating** (select): 4+ stars, 3+ stars, etc.
- Clear Filters button

**Results Grid** (SearchResults component):
- Cards in responsive grid (1 col mobile, 2-3 cols desktop)
- Each card shows:
  - Profile picture or avatar fallback
  - Name and specialty
  - Credentials
  - Rating (stars) and review count
  - Consultation types (badges)
  - "View Profile" button
  - "Book Appointment" button

**Empty State**:
- Friendly message: "No practitioners found"
- Suggestion to adjust filters

### 5. Practitioner Profile Page (`/practitioner/[id]`)

**Layout**:
- Hero section with practitioner info
- About section
- Consultation types
- Reviews section
- Book appointment CTA

**Practitioner Info Card**:
- Large profile picture
- Name (h1)
- Specialty and credentials
- Rating and reviews
- Consultation types (badges)
- Primary action: "Book Appointment" button

**About Section**:
- Bio text
- Education & credentials
- Specialties & expertise

**Reviews Section**:
- List of reviews with:
  - Patient name (or Anonymous)
  - Star rating
  - Comment text
  - Date

**Booking CTA**:
- Sticky or prominent "Book Appointment" button
- Redirects to `/booking/[practitionerId]`

### 6. Booking Page (`/booking/[practitionerId]`)

**Layout**:
- Practitioner info summary card at top
- Appointment form
- Confirmation message

**Form Fields**:
- **Date** (date picker): Required, min date = today
- **Time** (time picker): Required
- **Consultation Type** (select): Virtual or In-Person
- **Reason for Visit** (text input): Required, brief description
- **Additional Notes** (textarea): Optional

**Practitioner Card**:
- Small profile picture
- Name, specialty, credentials
- Highlighted background

**Actions**:
- Cancel button (go back)
- "Confirm Booking" button (primary)

**Success Flow**:
- Create appointment in database
- Show success message with checkmark icon
- Display appointment details
- "Go to Dashboard" button
- Auto-redirect after 3 seconds

### 7. Patient Dashboard (`/dashboard`)

**Protected**: Requires patient role

**Layout**:
- Welcome header with user name
- Tabs: "Upcoming Appointments" and "Past Appointments"

**Upcoming Appointments Tab**:
- List of future appointments
- Each card shows:
  - Practitioner name and specialty
  - Date, time, type
  - Status badge (pending/confirmed)
  - "View Practitioner" button
  - "Cancel" button

**Past Appointments Tab**:
- Historical appointments
- Shows status (completed/cancelled)
- No action buttons

**Empty States**:
- "No Upcoming Appointments"
- Calendar icon
- "Find a Practitioner" CTA button

**Chatbot**:
- Floating chat button (bottom-right)
- Only visible to patients
- Opens health assistant chat

### 8. Practitioner Dashboard (`/practitioner/dashboard`)

**Protected**: Requires practitioner role

**Layout**:
- Welcome banner with name
- Stats cards (3 columns):
  1. Today's Appointments (count)
  2. Upcoming Appointments (count)
  3. Total Patients (unique count)

**Today's Schedule Section**:
- Card with today's appointments
- Each appointment shows:
  - Time range
  - Appointment type
  - Notes
  - Status badge
- Empty state: "No schedule for today"

**Upcoming & Completed Preview**:
- Two-column grid
- Upcoming appointments preview (next 3)
- Completed appointments preview (last 3)
- Shows counts

**Navigation Links**:
- Dashboard (current)
- Schedule (manage availability)
- Appointment History (all appointments)
- Edit Account (update profile)

### 9. Practitioner Schedule (`/practitioner/schedule`)

**Purpose**: Manage availability and time slots

**Features**:
- Calendar view
- Set available hours
- Block time slots
- Set recurring availability

*(Implementation details can vary based on requirements)*

### 10. Practitioner Appointment History (`/practitioner/appointment-history`)

**Layout**:
- Table or list of all appointments
- Filters: All, Upcoming, Completed, Cancelled
- Search by patient name or date

**Columns**:
- Patient (name or anonymous)
- Date & Time
- Type
- Status
- Actions (view details, mark complete)

### 11. Practitioner Edit Account (`/practitioner/edit-account`)

**Form to Update**:
- Professional info (specialty, credentials)
- Bio
- Profile picture
- Consultation types
- Contact information

**Actions**:
- Save changes
- Cancel

### 12. Admin Users Page (`/admin/users`)

**Protected**: Requires admin role

**Layout**:
- Header with "Create User" button
- User management table

**User Table** (UserManagementTable component):
- Columns: Name, Email, Role, Created At, Actions
- Actions: Edit role, Delete user
- Pagination (if needed)

**Create User Modal**:
- Form with fields:
  - Full Name
  - Email
  - Password
  - Role (select: patient, practitioner, admin)
- Submit creates user via API

**API Endpoint** (`/api/admin/users`):
- GET: Fetch all users (includes emails via service role)
- Uses Supabase Admin client (service role key)

---

## 🤖 AI Health Assistant (Chatbot)

### Overview
JSON-based dialogue map system that:
- Detects symptoms from patient messages
- Asks relevant follow-up questions
- Recommends best-fit practitioners based on weighted scoring
- Provides booking functionality

### Architecture

**Components**:
1. `health-assistant.tsx`: Chat UI interface
2. `chatbot-wrapper.tsx`: Floating chat button (only for patients)
3. `/api/chat/route.ts`: AI logic and matching algorithm
4. `data/dialogue-map.json`: Knowledge base (doctors + symptoms)

### Chat UI Features

**Interface**:
- Chat bubble interface
- User messages (right-aligned, blue)
- Bot messages (left-aligned, gray)
- Auto-scroll to latest message
- Input field with send button
- Close button

**Bot Capabilities**:
- Greeting message
- Symptom detection from free-form text
- Follow-up questions
- Doctor recommendations with booking cards
- Handles multiple symptoms

**Booking Card**:
- Shows recommended doctor
- Name, specialty, description
- "Book Appointment" button
- Links to `/booking/[doctorId]`

### Dialogue Map Structure

**File**: `src/data/dialogue-map.json`

```json
{
  "doctors": [
    {
      "id": "practitioner_uuid_from_database",
      "name": "Dr. Sarah Smith",
      "specialty": "General Practitioner",
      "description": "Primary care and common ailments",
      "weights": {
        "fever": 0.8,
        "cough": 0.9,
        "sore_throat": 0.8,
        "head_pain": 0.7
      }
    }
  ],
  "symptoms": {
    "fever": {
      "keywords": ["fever", "high temperature", "hot", "burning up"],
      "follow_up": "How high is your temperature? Any other symptoms?",
      "aliases": ["temperature", "pyrexia"]
    },
    "cough": {
      "keywords": ["cough", "coughing", "hacking"],
      "follow_up": "Is the cough dry or productive? Any pain?",
      "aliases": ["persistent cough"]
    }
  }
}
```

### Matching Algorithm

**Flow**:
1. **Parse Message**: Extract keywords from user input
2. **Detect Symptoms**: Match against symptom keywords (case-insensitive)
3. **Calculate Scores**: For each doctor, sum (symptom_weight × confidence)
4. **Rank Doctors**: Sort by total score
5. **Recommend**:
   - If top score > 1.5× second score → recommend 1 doctor
   - Otherwise → recommend top 2 doctors
6. **Ask Follow-up**: If insufficient data, ask clarifying question

**Conversation Context**:
- Track detected symptoms
- Store message count
- Track questions asked
- Recommend after 2+ messages

### API Endpoint (`/api/chat`)

**POST Request**:
```typescript
{
  message: string;
  context?: {
    detectedSymptoms: string[];
    messageCount: number;
  };
}
```

**Response**:
```typescript
{
  reply: string;
  context: {
    detectedSymptoms: string[];
    messageCount: number;
  };
  recommendedDoctors?: Array<{
    id: string;
    name: string;
    specialty: string;
    description: string;
    score: number;
  }>;
}
```

### Chatbot Visibility
- **Show**: When user is a patient
- **Hide**: When user is practitioner, admin, or not logged in
- Position: Fixed bottom-right corner
- Icon: MessageCircle with badge

---

## 🎯 Key Features Implementation

### Feature 1: Role-Based Navigation

**Header Navigation Changes by Role**:

**Anonymous/Patient**:
- Find Practitioners → `/search`
- For Practitioners → `/practitioner-signup`
- Dashboard → `/dashboard` (if logged in)
- Sign In / Sign Up buttons

**Practitioner**:
- Dashboard → `/practitioner/dashboard`
- Schedule → `/practitioner/schedule`
- Appointment History → `/practitioner/appointment-history`
- Edit Account → `/practitioner/edit-account`
- Shows Doctor logo

**Admin**:
- User Management → `/admin/users`

**Active Link Highlighting**:
- Active links have colored background (role-specific color)
- Patient links: Cyan background (#1cabb0)
- Practitioner links: Lime green (#8cc342)

### Feature 2: Dynamic Logo System

**Logic**:
- If practitioner logged in → Show Doctors_icon.png
- Otherwise → Show Patients_Icon.png
- Logo size: 192x192px (h-48 w-48 in Tailwind)
- Logo is clickable, links to homepage

### Feature 3: Appointment Management

**Patient Actions**:
- View upcoming and past appointments
- Cancel upcoming appointments
- View practitioner details

**Practitioner Actions**:
- View all appointments (today, upcoming, completed)
- Mark appointments as completed
- View patient information (limited by privacy)

**Status Flow**:
- pending → confirmed → completed
- pending → cancelled
- Status badges with color coding

### Feature 4: Search & Discovery

**Search Flow**:
1. User enters search criteria on homepage or /search
2. Filters applied: specialty, consultation type, date, rating
3. Query practitioners table with filters
4. Display results in responsive grid
5. Each card links to profile and booking pages

**Filter Persistence**:
- Filters stored in URL query params
- Shareable search URLs
- Filters persist on page refresh

### Feature 5: File Upload (Practitioner Signup)

**Supabase Storage Setup**:
- Bucket: `practitioner-files`
- Folders: `profile-pictures/`, `id-verification/`
- Public access for profile pictures
- Private access for ID documents

**Upload Flow**:
1. User selects file (validate: image, max 5MB)
2. Upload to Supabase Storage
3. Get public URL
4. Store URL in database
5. Display uploaded image

**Component**: `file-upload.tsx`
- Drag & drop support
- File type validation
- Progress indicator
- Preview uploaded image

### Feature 6: Admin User Management

**Create User Flow**:
1. Admin clicks "Create User" button
2. Modal opens with form
3. Fill in: name, email, password, role
4. Submit to `/api/seed-users` or create function
5. User created in Supabase Auth
6. Profile created in database
7. Practitioner record created if role='practitioner'
8. Table refreshes with new user

**Edit Role**:
- Inline edit in table
- Update `role` field in profiles
- Restricted to admins only

**Delete User**:
- Confirmation dialog
- Cascade delete (auth.users → profiles → related records)
- Only admins can delete

---

## 🎨 UI Component Library (Shadcn UI)

### Installation Commands
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select textarea
npx shadcn-ui@latest add dialog dropdown-menu avatar badge alert tabs table
npx shadcn-ui@latest add checkbox radio-group
```

### Core Components to Implement

1. **Button** (`button.tsx`)
   - Variants: default, secondary, outline, ghost, destructive
   - Sizes: sm, md, lg
   - Using class-variance-authority

2. **Card** (`card.tsx`)
   - CardHeader, CardTitle, CardDescription, CardContent, CardFooter

3. **Input** (`input.tsx`)
   - Standard text input
   - Focus ring with primary color

4. **Select** (`select.tsx`)
   - Radix UI Select primitive
   - Custom styling

5. **Dialog** (`dialog.tsx`)
   - Modal overlay
   - DialogContent, DialogHeader, DialogTitle, DialogDescription
   - Close button

6. **Dropdown Menu** (`dropdown-menu.tsx`)
   - User menu in header
   - DropdownMenuItem, DropdownMenuSeparator

7. **Avatar** (`avatar.tsx`)
   - User profile pictures
   - Fallback to initials

8. **Badge** (`badge.tsx`)
   - Status indicators
   - Variants: default, secondary, destructive, outline

9. **Tabs** (`tabs.tsx`)
   - Dashboard sections
   - TabsList, TabsTrigger, TabsContent

10. **Table** (`table.tsx`)
    - Admin user table
    - TableHeader, TableBody, TableRow, TableHead, TableCell

---

## 🔧 Implementation Steps

### Phase 1: Project Setup (Step 1)
1. Initialize Next.js 14 project with TypeScript
2. Install all dependencies
3. Set up Tailwind CSS configuration
4. Create globals.css with theme variables
5. Add logo images to `icons/` folder
6. Configure Supabase project
7. Set up environment variables

### Phase 2: Authentication (Step 2)
1. Create Supabase client
2. Implement auth provider context
3. Build sign-in form
4. Build patient sign-up form
5. Build practitioner multi-step sign-up form
6. Create protected route component
7. Set up middleware for route protection

### Phase 3: Database & Schema (Step 3)
1. Run SQL script to create all tables
2. Set up RLS policies
3. Create indexes
4. Test database connections
5. Implement database utility functions in `lib/database.ts`

### Phase 4: Layout & Navigation (Step 4)
1. Create root layout with providers
2. Build header component with role-based navigation
3. Implement main layout wrapper
4. Add logo switching logic
5. Style active navigation links

### Phase 5: Homepage (Step 5)
1. Build hero section with illustration
2. Create search card component
3. Implement How It Works section
4. Build featured practitioners component
5. Add leaf pattern backgrounds

### Phase 6: Practitioner Search (Step 6)
1. Create search page layout
2. Build search filters component
3. Implement search results grid
4. Connect to database queries
5. Add empty states

### Phase 7: Practitioner Profiles (Step 7)
1. Create profile page layout
2. Display practitioner information
3. Show reviews section
4. Add booking CTA

### Phase 8: Booking System (Step 8)
1. Build booking form
2. Implement date/time pickers
3. Create appointment in database
4. Show confirmation page
5. Handle booking errors

### Phase 9: Patient Dashboard (Step 9)
1. Create dashboard layout
2. Fetch and display appointments
3. Implement tabs (upcoming/past)
4. Add cancel appointment functionality
5. Style appointment cards

### Phase 10: Practitioner Dashboard (Step 10)
1. Build practitioner dashboard
2. Create stats cards
3. Show today's schedule
4. Display upcoming and completed previews
5. Add navigation to other practitioner pages

### Phase 11: Practitioner Features (Step 11)
1. Implement schedule management
2. Create appointment history view
3. Build edit account form
4. Add profile picture upload

### Phase 12: Admin Panel (Step 12)
1. Create admin users page
2. Build user management table
3. Implement create user modal
4. Add role editing
5. Create admin API routes

### Phase 13: Chatbot (Step 13)
1. Create dialogue-map.json
2. Build chat UI component
3. Implement floating chat button
4. Create API route with matching algorithm
5. Test symptom detection and recommendations

### Phase 14: UI Components (Step 14)
1. Install and configure Shadcn UI
2. Create all necessary UI components
3. Style with Tailwind CSS
4. Test responsiveness

### Phase 15: Testing & Polish (Step 15)
1. Test all user flows
2. Check responsive design
3. Verify authentication and authorization
4. Test database queries
5. Add loading and error states
6. Optimize performance
7. Fix any bugs

---

## 📝 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🎨 Design Guidelines

### Spacing & Layout
- Container max-width with padding
- Consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Use Tailwind spacing utilities

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Stack columns on mobile
- Reduce padding/margins on small screens

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus states on interactive elements
- Sufficient color contrast

### Loading States
- Skeleton screens for initial loads
- Spinner (Loader2 icon) for actions
- Disable buttons during submission
- Show loading text

### Error Handling
- Toast notifications (can use Alert component)
- Form validation errors below fields
- Friendly error messages
- Retry functionality

### Empty States
- Icon + message + CTA
- Friendly, helpful copy
- Clear next action

---

## 🚀 Additional Features to Consider

1. **Email Notifications**:
   - Appointment confirmations
   - Reminders
   - Cancellation notifications

2. **Real-time Updates**:
   - Supabase Realtime for live appointment updates
   - Notification badges

3. **Calendar Integration**:
   - Export to Google Calendar
   - iCal format

4. **Payment Integration**:
   - Stripe for appointment fees
   - Payment history

5. **Video Consultation**:
   - Integrate Zoom or Twilio
   - In-app video calls

6. **Reviews & Ratings**:
   - Allow patients to review after appointments
   - Display average ratings

7. **Search Enhancements**:
   - Full-text search
   - Autocomplete
   - Filter by insurance accepted

8. **Analytics Dashboard**:
   - For practitioners: appointment stats, patient demographics
   - For admins: platform usage metrics

---

## 📚 Documentation to Create

1. **README.md**: Project overview, setup instructions, features
2. **API.md**: API routes documentation
3. **DEPLOYMENT.md**: Deployment guide (Vercel, etc.)
4. **CONTRIBUTING.md**: Contribution guidelines
5. **CHANGELOG.md**: Version history

---

## ✅ Checklist for Completion

### Setup
- [ ] Next.js 14 project initialized
- [ ] All dependencies installed
- [ ] Tailwind configured
- [ ] Supabase project created
- [ ] Environment variables set

### Database
- [ ] All tables created
- [ ] RLS policies applied
- [ ] Indexes created
- [ ] Admin function created
- [ ] Storage buckets configured

### Authentication
- [ ] Auth provider implemented
- [ ] Sign-in page working
- [ ] Patient sign-up working
- [ ] Practitioner sign-up working
- [ ] Protected routes working
- [ ] Role-based redirects working

### Pages
- [ ] Homepage complete
- [ ] Search page complete
- [ ] Practitioner profile complete
- [ ] Booking page complete
- [ ] Patient dashboard complete
- [ ] Practitioner dashboard complete
- [ ] Practitioner schedule complete
- [ ] Practitioner appointment history complete
- [ ] Practitioner edit account complete
- [ ] Admin users page complete

### Features
- [ ] Search and filtering working
- [ ] Appointment booking working
- [ ] Appointment management working
- [ ] File upload working
- [ ] Chatbot working
- [ ] Admin user management working

### UI/UX
- [ ] All Shadcn components installed
- [ ] Theme colors applied
- [ ] Leaf animations working
- [ ] Responsive design verified
- [ ] Loading states added
- [ ] Error states handled
- [ ] Empty states designed

### Testing
- [ ] All user flows tested
- [ ] Authentication tested
- [ ] Database queries tested
- [ ] File uploads tested
- [ ] Chatbot tested
- [ ] Admin functions tested

### Deployment
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Supabase production instance ready
- [ ] Domain configured
- [ ] SSL certificate active

---

## 🎓 Learning Resources

- **Next.js 14**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn UI**: https://ui.shadcn.com
- **Radix UI**: https://www.radix-ui.com
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 💡 Tips for Implementation

1. **Start Small**: Begin with authentication and basic pages, then add features
2. **Test Often**: Test each feature as you build it
3. **Component Reuse**: Create reusable components early
4. **Type Safety**: Define TypeScript interfaces for all data structures
5. **Database First**: Set up and test database before building UI
6. **Mobile First**: Design for mobile, then scale up
7. **Commit Often**: Use git to track progress and allow rollbacks
8. **Document As You Go**: Comment complex logic, maintain documentation

---

## 🎯 Success Criteria

Your implementation is complete when:
1. ✅ All three user roles can sign up and sign in
2. ✅ Patients can search, view, and book practitioners
3. ✅ Practitioners can manage appointments and profile
4. ✅ Admins can create and manage users
5. ✅ Chatbot provides doctor recommendations
6. ✅ Design matches the green healthcare theme
7. ✅ All pages are responsive
8. ✅ Role-based navigation works correctly
9. ✅ Authentication and authorization secure
10. ✅ Database queries are efficient and secure

---

**Good luck building your Kari Healthcare Platform! 🚀🏥**

