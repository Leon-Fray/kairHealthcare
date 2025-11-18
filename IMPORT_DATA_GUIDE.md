# Guide to Importing Test Data

The CSV files require users to exist in `auth.users` first. Here are three ways to set this up:

## Option 1: Use Supabase Admin API (Recommended)

Create a script to use the Supabase Admin API to create users. This is the most reliable method.

### Step 1: Create the script

Create a file `create-test-users.js` (or use the provided script):

```javascript
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const users = [
  { id: '550e8400-e29b-41d4-a716-446655440000', email: 'john.smith@test.com', full_name: 'John Smith', role: 'patient' },
  { id: '550e8400-e29b-41d4-a716-446655440001', email: 'sarah.johnson@test.com', full_name: 'Sarah Johnson', role: 'patient' },
  { id: '550e8400-e29b-41d4-a716-446655440002', email: 'michael.chen@test.com', full_name: 'Michael Chen', role: 'patient' },
  { id: '550e8400-e29b-41d4-a716-446655440003', email: 'emily.davis@test.com', full_name: 'Emily Davis', role: 'patient' },
  { id: '550e8400-e29b-41d4-a716-446655440004', email: 'david.wilson@test.com', full_name: 'David Wilson', role: 'patient' },
  { id: '550e8400-e29b-41d4-a716-446655440010', email: 'dr.anderson@test.com', full_name: 'Dr. James Anderson', role: 'practitioner' },
  { id: '550e8400-e29b-41d4-a716-446655440011', email: 'dr.garcia@test.com', full_name: 'Dr. Maria Garcia', role: 'practitioner' },
  { id: '550e8400-e29b-41d4-a716-446655440012', email: 'dr.taylor@test.com', full_name: 'Dr. Robert Taylor', role: 'practitioner' },
  { id: '550e8400-e29b-41d4-a716-446655440013', email: 'dr.brown@test.com', full_name: 'Dr. Lisa Brown', role: 'practitioner' },
  { id: '550e8400-e29b-41d4-a716-446655440014', email: 'dr.martinez@test.com', full_name: 'Dr. Thomas Martinez', role: 'practitioner' },
  { id: '550e8400-e29b-41d4-a716-446655440020', email: 'admin@test.com', full_name: 'Admin User', role: 'admin' },
]

async function createUsers() {
  for (const user of users) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: 'TestPassword123!',
        email_confirm: true,
        user_metadata: { full_name: user.full_name }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`User ${user.email} already exists, skipping...`)
        } else {
          console.error(`Error creating ${user.email}:`, error.message)
        }
      } else {
        console.log(`✓ Created user: ${user.email}`)
      }
    } catch (err) {
      console.error(`Error with ${user.email}:`, err.message)
    }
  }
  console.log('\nAll users created! You can now import the CSV files.')
}

createUsers()
```

### Step 2: Run the script

```bash
node create-test-users.js
```

### Step 3: Import CSV files

After users are created, import the CSV files in this order:
1. `profiles.csv`
2. `practitioners.csv`
3. `appointments.csv`
4. `reviews.csv`

## Option 2: Use SQL Script (Requires Admin Access)

If you have direct database access with admin privileges:

1. Run `CREATE_TEST_USERS.sql` in Supabase SQL Editor
2. Then import the CSV files

**Note:** This method requires the `pgcrypto` extension and may not work if you don't have full database access.

## Option 3: Manual Creation via Supabase Dashboard

1. Go to your Supabase project → Authentication → Users
2. Create each user manually with the emails from the CSV files
3. Note the UUIDs that Supabase generates
4. Update the CSV files to use those UUIDs instead

## Option 4: Use Existing Users

If you already have users in your `auth.users` table:

1. Query your existing users:
   ```sql
   SELECT id, email FROM auth.users;
   ```

2. Update the CSV files to replace the UUIDs with your actual user IDs
3. Make sure you have at least:
   - 5 patients
   - 5 practitioners  
   - 1 admin

4. Import the CSV files

## Import Order

Always import in this order due to foreign key dependencies:

1. **profiles.csv** (requires users in auth.users)
2. **practitioners.csv** (requires profiles)
3. **appointments.csv** (requires profiles for both patient_id and practitioner_id)
4. **reviews.csv** (requires profiles for both patient_id and practitioner_id)

## Troubleshooting

### Error: "foreign key constraint violation"
- Make sure you've created users in `auth.users` first
- Verify the UUIDs in the CSV files match the user IDs in `auth.users`

### Error: "duplicate key value"
- The user/profile already exists
- Either delete existing records or use `ON CONFLICT` clauses in your import

### Error: "array format"
- For `consultation_types` in `practitioners.csv`, PostgreSQL expects `{value1,value2}` format
- The CSV already has this format, but some import tools may need quotes escaped differently

