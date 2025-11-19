import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">Search Practitioners</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

