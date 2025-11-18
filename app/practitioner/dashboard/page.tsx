'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getPractitionerAppointments } from '@/lib/database'
import { getInitials, formatDate, formatTime } from '@/lib/utils'
import { Calendar, Loader2, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface AppointmentWithPatient {
  id: string
  start_time: string
  end_time: string
  type: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  patient: {
    id: string
    full_name: string
  }
}

export default function PractitionerDashboard() {
  const { user, profile } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        const data = await getPractitionerAppointments(user.id) as any
        setAppointments(data)
        setLoading(false)
      }
    }
    loadAppointments()
  }, [user])

  // Calculate stats
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.start_time)
    return aptDate >= today && aptDate < tomorrow && apt.status !== 'cancelled'
  })

  const upcomingAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.start_time)
    return aptDate >= now && apt.status !== 'cancelled'
  })

  const completedAppointments = appointments.filter((apt) => apt.status === 'completed')

  const uniquePatients = new Set(appointments.map((apt) => apt.patient.id))
  const totalPatients = uniquePatients.size

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: AppointmentWithPatient }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-muted">
                {getInitials(appointment.patient.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{appointment.patient.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{appointment.type}</p>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
        {appointment.notes && (
          <p className="text-sm text-muted-foreground mt-3 pl-13">
            {appointment.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <ProtectedRoute requiredRole="practitioner">
        <MainLayout>
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="practitioner">
      <MainLayout>
        <div className="bg-gradient-green py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome, <span className="text-primary">Dr. {profile?.full_name}</span>!
            </h1>
            <p className="text-muted-foreground">
              Here's your practice overview for today
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Scheduled for today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Appointments
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  In your schedule
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Patients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  Unique patients served
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>
                    {formatDate(today.toISOString())}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No appointments scheduled for today
                      </p>
                    </div>
                  ) : (
                    todayAppointments
                      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                      .map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/practitioner/schedule">
                      <Calendar className="mr-2 w-4 h-4" />
                      Manage Schedule
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/practitioner/appointment-history">
                      <Clock className="mr-2 w-4 h-4" />
                      View All Appointments
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/practitioner/edit-account">
                      <Users className="mr-2 w-4 h-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Completed Appointments</p>
                      <p className="text-2xl font-bold text-primary">
                        {completedAppointments.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Keep up the great work!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

