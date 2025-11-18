'use client'

import type { PractitionerWithProfile } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'
import { Star, Loader2, Search } from 'lucide-react'

interface SearchResultsProps {
  practitioners: PractitionerWithProfile[]
  loading: boolean
}

export function SearchResults({ practitioners, loading }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (practitioners.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent className="space-y-4">
          <Search className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-xl font-semibold mb-2">No practitioners found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Found {practitioners.length} practitioner{practitioners.length !== 1 ? 's' : ''}
      </div>

      <div className="grid gap-6">
        {practitioners.map((practitioner) => (
          <Card key={practitioner.id} className="card-enhanced hover:shadow-xl transition-all">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={practitioner.profile_picture_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(practitioner.profiles.full_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {practitioner.profiles.full_name}
                      </CardTitle>
                      <CardDescription className="text-base mb-2">
                        {practitioner.specialty}
                      </CardDescription>
                      {practitioner.credentials && (
                        <p className="text-sm text-muted-foreground">
                          {practitioner.credentials}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center text-sm">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-muted-foreground ml-1">(32 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {practitioner.bio && (
                <p className="text-sm text-muted-foreground">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/practitioner/${practitioner.id}`}>
                    View Profile
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href={`/booking/${practitioner.id}`}>
                    Book Appointment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

