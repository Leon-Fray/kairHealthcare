'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SPECIALTIES = [
  'All Specialties',
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

interface SearchFiltersProps {
  specialty: string
  consultationType: string
  date: string
  rating: string
  location: string
  onSpecialtyChange: (value: string) => void
  onConsultationTypeChange: (value: string) => void
  onDateChange: (value: string) => void
  onRatingChange: (value: string) => void
  onLocationChange: (value: string) => void
  onClearFilters: () => void
}

export function SearchFilters({
  specialty,
  consultationType,
  date,
  rating,
  location,
  onSpecialtyChange,
  onConsultationTypeChange,
  onDateChange,
  onRatingChange,
  onLocationChange,
  onClearFilters,
}: SearchFiltersProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Specialty Filter */}
        <div className="space-y-2">
          <Label htmlFor="specialty-filter">Specialty</Label>
          <Select value={specialty} onValueChange={onSpecialtyChange}>
            <SelectTrigger id="specialty-filter">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((spec) => (
                <SelectItem key={spec} value={spec === 'All Specialties' ? 'all' : spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Consultation Type Filter */}
        <div className="space-y-2">
          <Label>Consultation Type</Label>
          <RadioGroup value={consultationType} onValueChange={onConsultationTypeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all-types" />
              <Label htmlFor="all-types" className="font-normal cursor-pointer">
                All Types
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="virtual" id="virtual" />
              <Label htmlFor="virtual" className="font-normal cursor-pointer">
                Virtual Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="in-person" />
              <Label htmlFor="in-person" className="font-normal cursor-pointer">
                In-Person Only
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="date-filter">Available On</Label>
          <Input
            id="date-filter"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <Label htmlFor="location-filter">Location</Label>
          <Input
            id="location-filter"
            type="text"
            placeholder="City or Zip Code"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label htmlFor="rating-filter">Minimum Rating</Label>
          <Select value={rating} onValueChange={onRatingChange}>
            <SelectTrigger id="rating-filter">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        <Button variant="outline" className="w-full" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}

