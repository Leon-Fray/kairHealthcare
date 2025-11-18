'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

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

export function SearchCard() {
  const [specialty, setSpecialty] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (specialty) params.set('specialty', specialty)
    if (date) params.set('date', date)
    if (location) params.set('location', location)
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg card-enhanced">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Find Your Healthcare Provider</h3>
          <p className="text-muted-foreground">
            Search by specialty, date, and location to find the right practitioner
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger id="specialty">
                <SelectValue placeholder="Select specialty" />
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
            <Label htmlFor="date">Preferred Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="City or Zip Code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleSearch} size="lg" className="w-full md:w-auto">
          <Search className="mr-2 w-4 h-4" />
          Search Practitioners
        </Button>
      </CardContent>
    </Card>
  )
}

