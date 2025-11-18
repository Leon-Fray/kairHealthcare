'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { searchPractitioners } from '@/lib/database'
import type { PractitionerWithProfile } from '@/types'

function SearchContent() {
  const searchParams = useSearchParams()
  const [practitioners, setPractitioners] = useState<PractitionerWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || 'all')
  const [consultationType, setConsultationType] = useState('')
  const [date, setDate] = useState(searchParams.get('date') || '')
  const [rating, setRating] = useState('all')
  const [location, setLocation] = useState(searchParams.get('location') || '')

  useEffect(() => {
    const loadPractitioners = async () => {
      setLoading(true)
      const data = await searchPractitioners({
        specialty: specialty === 'all' ? undefined : specialty,
        consultationType: consultationType || undefined,
      })
      setPractitioners(data)
      setLoading(false)
    }
    loadPractitioners()
  }, [specialty, consultationType])

  const handleClearFilters = () => {
    setSpecialty('all')
    setConsultationType('')
    setDate('')
    setRating('all')
    setLocation('')
  }

  return (
    <>
      <div className="bg-leaf-pattern py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Healthcare <span className="text-primary">Practitioners</span>
          </h1>
          <p className="text-muted-foreground">
            Browse our network of qualified healthcare professionals
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1">
            <SearchFilters
              specialty={specialty}
              consultationType={consultationType}
              date={date}
              rating={rating}
              location={location}
              onSpecialtyChange={setSpecialty}
              onConsultationTypeChange={setConsultationType}
              onDateChange={setDate}
              onRatingChange={setRating}
              onLocationChange={setLocation}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Results Grid */}
          <div className="md:col-span-3">
            <SearchResults practitioners={practitioners} loading={loading} />
          </div>
        </div>
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="bg-leaf-pattern py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Find Healthcare <span className="text-primary">Practitioners</span>
            </h1>
            <p className="text-muted-foreground">
              Browse our network of qualified healthcare professionals
            </p>
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </MainLayout>
  )
}

