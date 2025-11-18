'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { getPractitioner } from '@/lib/database'
import { createAppointment } from '@/lib/database'
import { useAuth } from '@/components/auth/auth-provider'
import { getInitials } from '@/lib/utils'
import { Loader2, CheckCircle2 } from 'lucide-react'
import type { PractitionerWithProfile } from '@/types'

export default function BookingPage() {
  const params = useParams()
  const [practitioner, setPractitioner] = useState<PractitionerWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [consultationType, setConsultationType] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const { user } = useAuth()
  const router = useRouter()
  const practitionerId = params.practitionerId as string

  useEffect(() => {
    if (!practitionerId) {
      setLoading(false)
      return
    }
    
    const loadPractitioner = async () => {
      try {
        const data = await getPractitioner(practitionerId)
        setPractitioner(data)
        setLoading(false)
      } catch (err) {
        console.error('Error loading practitioner:', err)
        setLoading(false)
      }
    }
    loadPractitioner()
  }, [practitionerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (!user) {
      setError('You must be signed in to book an appointment')
      setSubmitting(false)
      return
    }

    if (!date || !time || !consultationType || !reason || !email || !phone) {
      setError('Please fill in all required fields')
      setSubmitting(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setSubmitting(false)
      return
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(phone) || phone.length < 10) {
      setError('Please enter a valid phone number')
      setSubmitting(false)
      return
    }

    try {
      // Combine date and time
      const startTime = new Date(`${date}T${time}`)
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour later

      await createAppointment({
        patient_id: user.id,
        practitioner_id: practitionerId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        type: consultationType,
        notes: `Contact Information:\nEmail: ${email}\nPhone: ${phone}\n\nReason: ${reason}${notes ? `\n\nAdditional Notes: ${notes}` : ''}`,
      })

      setSuccess(true)
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to create appointment')
      setSubmitting(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="patient">
      {loading && (
        <MainLayout>
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </MainLayout>
      )}

      {!loading && !practitioner && (
        <MainLayout>
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Practitioner not found</h1>
            <Button asChild>
              <a href="/search">Back to Search</a>
            </Button>
          </div>
        </MainLayout>
      )}

      {!loading && practitioner && success && (
        <MainLayout>
          <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl">Appointment Booked!</CardTitle>
                <CardDescription className="text-base">
                  Your appointment has been successfully scheduled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Appointment Details</p>
                  <p className="font-semibold">{practitioner.profiles.full_name}</p>
                  <p className="text-sm text-muted-foreground">{practitioner.specialty}</p>
                  <p className="text-sm mt-2">{new Date(`${date}T${time}`).toLocaleString()}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your dashboard...
                </p>
                <Button asChild className="w-full">
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      )}

      {!loading && practitioner && !success && (
      <MainLayout>
        <div className="bg-leaf-pattern py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
            <p className="text-muted-foreground">
              Schedule your appointment with {practitioner.profiles.full_name}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Practitioner Summary Card */}
            <Card className="mb-8 bg-gradient-green">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={practitioner.profile_picture_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials(practitioner.profiles.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {practitioner.profiles.full_name}
                    </h2>
                    <p className="text-muted-foreground">{practitioner.specialty}</p>
                    {practitioner.credentials && (
                      <p className="text-sm text-muted-foreground">
                        {practitioner.credentials}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>
                  Fill in the information below to book your appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationType">Consultation Type *</Label>
                    <Select value={consultationType} onValueChange={setConsultationType}>
                      <SelectTrigger id="consultationType">
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {practitioner.consultation_types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit *</Label>
                    <Input
                      id="reason"
                      type="text"
                      placeholder="Brief description of your concern"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information you'd like to share"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Booking
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
      )}
    </ProtectedRoute>
  )
}
