'use client'

import { useEffect, useState } from 'react'
import { getAllPractitioners } from '@/lib/database'
import type { PractitionerWithProfile } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'
import { Loader2, Star } from 'lucide-react'

export function FeaturedPractitioners() {
  const [practitioners, setPractitioners] = useState<PractitionerWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPractitioners = async () => {
      const data = await getAllPractitioners()
      setPractitioners(data.slice(0, 6)) // Show only first 6
      setLoading(false)
    }
    loadPractitioners()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (practitioners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No practitioners available yet.</p>
      </div>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-green">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-primary">Practitioners</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our verified healthcare professionals ready to provide you with exceptional care
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practitioners.map((practitioner) => (
            <Card key={practitioner.id} className="card-enhanced practitioner-card-accent">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={practitioner.profile_picture_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(practitioner.profiles.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {practitioner.profiles.full_name}
                    </CardTitle>
                    <CardDescription>{practitioner.specialty}</CardDescription>
                    {practitioner.credentials && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {practitioner.credentials}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practitioner.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {practitioner.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {practitioner.consultation_types.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>4.8 (32 reviews)</span>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/practitioner/${practitioner.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/search">View All Practitioners</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

