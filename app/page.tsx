import { MainLayout } from '@/components/layout/main-layout'
import { HealthcareIllustration } from '@/components/home/healthcare-illustration'
import { SearchCard } from '@/components/home/search-card'
import { HowItWorks } from '@/components/home/how-it-works'
import { FeaturedPractitioners } from '@/components/home/featured-practitioners'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-leaf-pattern py-12 md:py-20">
        <div className="container mx-auto px-4 ml-12">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Find Your <span className="text-primary">Perfect Healthcare Match</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Connect with qualified healthcare professionals and book appointments that fit your schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">Get Started as Patient</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/practitioner-signup">Join as Practitioner</Link>
                </Button>
              </div>
            </div>
            <div>
              <HealthcareIllustration />
            </div>
          </div>

          {/* Search Card */}
          <SearchCard />
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Featured Practitioners */}
      <FeaturedPractitioners />
    </MainLayout>
  )
}

