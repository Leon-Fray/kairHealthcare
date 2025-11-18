import { MainLayout } from '@/components/layout/main-layout'
import { getPractitioner, getPractitionerReviews } from '@/lib/database'
import { PractitionerProfileView } from '@/components/practitioner/practitioner-profile-view'
import { notFound } from 'next/navigation'

export default async function PractitionerProfilePage({
  params,
}: {
  params: { id: string }
}) {
  console.log('[Profile Page] Loading practitioner with ID:', params.id)
  const practitioner = await getPractitioner(params.id)
  
  if (!practitioner) {
    console.log('[Profile Page] Practitioner not found:', params.id)
    notFound()
  }
  
  console.log('[Profile Page] Successfully loaded practitioner:', practitioner.profiles.full_name)

  const reviews = await getPractitionerReviews(params.id)
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0

  return (
    <MainLayout>
      <PractitionerProfileView
        practitioner={practitioner}
        reviews={reviews}
        averageRating={averageRating}
      />
    </MainLayout>
  )
}

