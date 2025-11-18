'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getPractitioner, updatePractitioner } from '@/lib/database'
import { Loader2, CheckCircle2 } from 'lucide-react'
import type { PractitionerWithProfile } from '@/types'

const SPECIALTIES = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Ophthalmology',
  'Dentistry',
  'Physical Therapy',
]

const CONSULTATION_TYPES = [
  { id: 'virtual', label: 'Virtual Consultation' },
  { id: 'in-person', label: 'In-Person Visit' },
  { id: 'home-visit', label: 'Home Visit' },
]

export default function EditAccountPage() {
  const { user, refreshProfile } = useAuth()
  const [practitioner, setPractitioner] = useState<PractitionerWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [specialty, setSpecialty] = useState('')
  const [credentials, setCredentials] = useState('')
  const [consultationTypes, setConsultationTypes] = useState<string[]>([])
  const [bio, setBio] = useState('')

  useEffect(() => {
    const loadPractitioner = async () => {
      if (user) {
        const data = await getPractitioner(user.id)
        setPractitioner(data)
        if (data) {
          setSpecialty(data.specialty)
          setCredentials(data.credentials || '')
          setConsultationTypes(data.consultation_types)
          setBio(data.bio || '')
        }
        setLoading(false)
      }
    }
    loadPractitioner()
  }, [user])

  const handleConsultationTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setConsultationTypes([...consultationTypes, type])
    } else {
      setConsultationTypes(consultationTypes.filter((t) => t !== type))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSubmitting(true)

    if (!user) {
      setError('Not authenticated')
      setSubmitting(false)
      return
    }

    if (!specialty || consultationTypes.length === 0) {
      setError('Please fill in all required fields')
      setSubmitting(false)
      return
    }

    try {
      await updatePractitioner(user.id, {
        specialty,
        credentials: credentials || undefined,
        consultation_types: consultationTypes,
        bio: bio || undefined,
      })

      await refreshProfile()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="practitioner">
        <MainLayout>
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="practitioner">
      <MainLayout>
        <div className="bg-gradient-green py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Edit <span className="text-primary">Profile</span>
            </h1>
            <p className="text-muted-foreground">
              Update your professional information
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Keep your profile up to date to attract more patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-900 border-green-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <AlertDescription>
                      Profile updated successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty *</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credentials">Credentials</Label>
                  <Input
                    id="credentials"
                    type="text"
                    placeholder="e.g., MD, Board Certified"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Consultation Types *</Label>
                  {CONSULTATION_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={consultationTypes.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleConsultationTypeChange(type.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={type.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell patients about your experience, approach to care, and areas of expertise..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

