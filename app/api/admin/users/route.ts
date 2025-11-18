import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const adminClient = getSupabaseAdmin()
    
    // Get all users from auth.users
    const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers()
    
    if (usersError) throw usersError

    // Get all profiles
    const { data: profiles, error: profilesError } = await adminClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (profilesError) throw profilesError

    // Merge user data with profiles
    const usersWithProfiles = users.map((user) => {
      const profile = profiles?.find((p) => p.id === user.id)
      return {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || 'N/A',
        role: profile?.role || 'patient',
        created_at: profile?.created_at || user.created_at,
      }
    })

    return NextResponse.json(usersWithProfiles)
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, full_name, role } = body

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const adminClient = getSupabaseAdmin()

    // Create user in auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Failed to create user')

    // Check if profile already exists
    const { data: existingProfile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('id', authData.user.id)
      .single()

    // Only create profile if it doesn't exist
    if (!existingProfile) {
      const { error: profileError } = await adminClient
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name,
          role,
        })

      if (profileError) throw profileError
    }

    // If practitioner, check and create practitioner record
    if (role === 'practitioner') {
      const { data: existingPractitioner } = await adminClient
        .from('practitioners')
        .select('id')
        .eq('id', authData.user.id)
        .single()

      if (!existingPractitioner) {
        const { error: practitionerError } = await adminClient
          .from('practitioners')
          .insert({
            id: authData.user.id,
            specialty: 'General Practice',
            consultation_types: ['virtual'],
          })

        if (practitionerError) throw practitionerError
      }
    }

    return NextResponse.json({ success: true, user: authData.user })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const adminClient = getSupabaseAdmin()

    // Delete user (cascades to profiles and other tables)
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, role } = body

    if (!id || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const adminClient = getSupabaseAdmin()

    // Update profile role
    const { error } = await adminClient
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

