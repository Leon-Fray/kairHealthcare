import { supabase } from './supabaseClient'
import type { Profile, Practitioner, Appointment, Review, PractitionerWithProfile } from '@/types'

// Profile queries
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()

  if (error) throw error
  return data
}

// Practitioner queries
export async function getPractitioner(id: string) {
  console.log('[Database] Fetching practitioner with ID:', id)
  const { data, error } = await supabase
    .from('practitioners')
    .select(`
      *,
      profiles (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('[Database] Error fetching practitioner:', error)
    return null
  }

  if (!data) {
    console.log('[Database] No practitioner found with ID:', id)
    return null
  }

  console.log('[Database] Successfully fetched practitioner:', data)
  return data as PractitionerWithProfile
}

export async function getAllPractitioners() {
  const { data, error } = await supabase
    .from('practitioners')
    .select(`
      *,
      profiles (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching practitioners:', error)
    return []
  }

  return data as PractitionerWithProfile[]
}

export async function searchPractitioners(filters: {
  specialty?: string
  consultationType?: string
}) {
  let query = supabase
    .from('practitioners')
    .select(`
      *,
      profiles (*)
    `)

  if (filters.specialty) {
    query = query.eq('specialty', filters.specialty)
  }

  if (filters.consultationType) {
    query = query.contains('consultation_types', [filters.consultationType])
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching practitioners:', error)
    return []
  }

  return data as PractitionerWithProfile[]
}

export async function createPractitioner(practitioner: Omit<Practitioner, 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('practitioners')
    .insert(practitioner)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePractitioner(id: string, updates: Partial<Practitioner>) {
  const { data, error } = await supabase
    .from('practitioners')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Appointment queries
export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'status'>) {
  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...appointment, status: 'pending' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPatientAppointments(patientId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      practitioner:profiles!appointments_practitioner_id_fkey (
        *,
        practitioners (*)
      )
    `)
    .eq('patient_id', patientId)
    .order('start_time', { ascending: true })

  if (data) {
    console.log(`[Database] Fetched ${data.length} appointments for patient ${patientId}`)
  }

  if (error) {
    console.error('Error fetching patient appointments:', error)
    return []
  }

  return data
}

export async function getPractitionerAppointments(practitionerId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:profiles!appointments_patient_id_fkey (*)
    `)
    .eq('practitioner_id', practitionerId)
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching practitioner appointments:', error)
    return []
  }

  return data
}

export async function updateAppointmentStatus(appointmentId: string, status: Appointment['status']) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', appointmentId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Review queries
export async function getPractitionerReviews(practitionerId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      patient:profiles!reviews_patient_id_fkey (*)
    `)
    .eq('practitioner_id', practitionerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPractitionerAverageRating(practitionerId: string): Promise<number> {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('practitioner_id', practitionerId)

  if (error || !data || data.length === 0) {
    return 0
  }

  const sum = data.reduce((acc, review) => acc + review.rating, 0)
  return sum / data.length
}

