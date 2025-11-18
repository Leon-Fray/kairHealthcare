'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { uploadProfilePicture, uploadIdDocument, validateImageFile } from '@/lib/storage'

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

export function PractitionerSignUpForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Step 1: Account Information
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2: Professional Information
  const [specialty, setSpecialty] = useState('')
  const [credentials, setCredentials] = useState('')
  const [consultationTypes, setConsultationTypes] = useState<string[]>([])

  // Step 3: Profile Details
  const [bio, setBio] = useState('')
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleConsultationTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setConsultationTypes([...consultationTypes, type])
    } else {
      setConsultationTypes(consultationTypes.filter(t => t !== type))
    }
  }

  const validateStep1 = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!specialty) {
      setError('Please select a specialty')
      return false
    }
    if (consultationTypes.length === 0) {
      setError('Please select at least one consultation type')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!acceptTerms) {
      setError('You must accept the terms and conditions')
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    
    setStep(step + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateStep3()) return

    setLoading(true)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      const userId = authData.user.id

      // Upload files
      let profilePictureUrl = null
      let idImageUrl = null

      if (profilePicture) {
        const validation = validateImageFile(profilePicture)
        if (!validation.valid) throw new Error(validation.error)
        profilePictureUrl = await uploadProfilePicture(profilePicture, userId)
      }

      if (idDocument) {
        const validation = validateImageFile(idDocument)
        if (!validation.valid) throw new Error(validation.error)
        idImageUrl = await uploadIdDocument(idDocument, userId)
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      // Only create profile if it doesn't exist
      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: fullName,
            role: 'practitioner',
          })

        if (profileError) throw profileError
      }

      // Check if practitioner record already exists
      const { data: existingPractitioner } = await supabase
        .from('practitioners')
        .select('id')
        .eq('id', userId)
        .single()

      // Only create practitioner record if it doesn't exist
      if (!existingPractitioner) {
        const { error: practitionerError } = await supabase
          .from('practitioners')
          .insert({
            id: userId,
            specialty,
            credentials: credentials || null,
            consultation_types: consultationTypes,
            bio: bio || null,
            profile_picture_url: profilePictureUrl,
            id_image_url: idImageUrl,
          })

        if (practitionerError) throw practitionerError
      }

      // Success! Redirect to dashboard
      router.push('/practitioner/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Practitioner Registration - Step {step}/3</CardTitle>
        <CardDescription>
          {step === 1 && 'Create your account'}
          {step === 2 && 'Tell us about your professional background'}
          {step === 3 && 'Complete your profile'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Account Information */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Dr. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Step 2: Professional Information */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger>
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
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Profile Details */}
          {step === 3 && (
            <>
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

              <div className="space-y-2">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  Max 5MB. JPG, PNG, or WebP
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idDocument">ID Verification Document</Label>
                <Input
                  id="idDocument"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  Upload a photo of your medical license or professional ID
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions *
                </label>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          
          <div className="ml-auto">
            {step < 3 ? (
              <Button type="submit">
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Registration
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

