'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getInitials, formatDate } from '@/lib/utils'
import { Star, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { PractitionerWithProfile, ReviewWithPatient } from '@/types'

interface PractitionerProfileViewProps {
  practitioner: PractitionerWithProfile
  reviews: ReviewWithPatient[]
  averageRating: number
}

export function PractitionerProfileView({
  practitioner,
  reviews,
  averageRating,
}: PractitionerProfileViewProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-green py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={practitioner.profile_picture_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {getInitials(practitioner.profiles.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {practitioner.profiles.full_name}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {practitioner.specialty}
              </p>
              {practitioner.credentials && (
                <p className="text-muted-foreground mb-4 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {practitioner.credentials}
                </p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {practitioner.consultation_types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-sm">
                    {type}
                  </Badge>
                ))}
              </div>

              <Button size="lg" asChild>
                <Link href={`/booking/${practitioner.id}`}>
                  <Calendar className="mr-2 w-5 h-5" />
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              {practitioner.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {practitioner.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Reviews</CardTitle>
                  <CardDescription>
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No reviews yet
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-muted">
                                {getInitials(review.patient.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.patient.full_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(review.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Consultation Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {practitioner.consultation_types.map((type) => (
                      <li key={type} className="flex items-center text-sm">
                        <span className="w-2 h-2 rounded-full bg-primary mr-3" />
                        {type}
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" asChild>
                    <Link href={`/booking/${practitioner.id}`}>
                      Book Appointment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

