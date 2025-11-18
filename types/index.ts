export interface Profile {
  id: string
  full_name: string
  role: 'patient' | 'practitioner' | 'admin'
  created_at: string
  updated_at: string
}

export interface Practitioner {
  id: string
  specialty: string
  credentials?: string
  consultation_types: string[]
  bio?: string
  profile_picture_url?: string
  id_image_url?: string
  created_at: string
  updated_at: string
}

export interface PractitionerWithProfile extends Practitioner {
  profiles: Profile
}

export interface Appointment {
  id: string
  patient_id: string
  practitioner_id: string
  start_time: string
  end_time: string
  type: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  created_at: string
  updated_at: string
}

export interface AppointmentWithDetails extends Appointment {
  patient: Profile
  practitioner: Profile & { practitioners: Practitioner }
}

export interface Review {
  id: string
  patient_id: string
  practitioner_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface ReviewWithPatient extends Review {
  patient: Profile
}

export type UserRole = 'patient' | 'practitioner' | 'admin'

export interface AuthUser {
  user: {
    id: string
    email: string
  } | null
  profile: Profile | null
  loading: boolean
}

