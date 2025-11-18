'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export default function PractitionerSchedulePage() {
  return (
    <ProtectedRoute requiredRole="practitioner">
      <MainLayout>
        <div className="bg-gradient-green py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Manage <span className="text-primary">Schedule</span>
            </h1>
            <p className="text-muted-foreground">
              Set your availability and manage your calendar
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Schedule Management</CardTitle>
              <CardDescription>
                This feature is coming soon!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Schedule management functionality will allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Set your available hours and days</li>
                <li>Block out time slots for breaks or personal time</li>
                <li>Set recurring availability patterns</li>
                <li>Manage appointment durations</li>
                <li>Handle time-off requests</li>
              </ul>
              <Button asChild>
                <a href="/practitioner/dashboard">Back to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

