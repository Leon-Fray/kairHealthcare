const { createClient } = require('@supabase/supabase-js')

// Try to load .env.local if dotenv is available
try {
  require('dotenv').config({ path: '.env.local' })
} catch (e) {
  // dotenv not installed, will use process.env directly
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
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
  console.log('Creating test users...\n')
  
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
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          console.log(`⚠ User ${user.email} already exists, skipping...`)
        } else {
          console.error(`✗ Error creating ${user.email}:`, error.message)
        }
      } else {
        console.log(`✓ Created user: ${user.email} (${user.role})`)
      }
    } catch (err) {
      console.error(`✗ Error with ${user.email}:`, err.message)
    }
  }
  
  console.log('\n✓ User creation complete!')
  console.log('\nNext steps:')
  console.log('1. Import profiles.csv')
  console.log('2. Import practitioners.csv')
  console.log('3. Import appointments.csv')
  console.log('4. Import reviews.csv')
}

createUsers().catch(console.error)

