'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getPatientAppointments, updateAppointmentStatus } from '@/lib/database'
import { getInitials, formatDate, formatTime } from '@/lib/utils'
import { Calendar, Loader2, MapPin, Video, Home as HomeIcon } from 'lucide-react'
import Link from 'next/link'

interface AppointmentWithPractitioner {
  id: string
  start_time: string
  end_time: string
  type: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  practitioner: {
    id: string
    full_name: string
    practitioners: {
      specialty: string
      profile_picture_url?: string
    }
  }
}

export default function PatientDashboard() {
  const { user, profile } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentWithPractitioner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        const data = await getPatientAppointments(user.id) as any
        setAppointments(data)
        setLoading(false)
      }
    }
    loadAppointments()
  }, [user])

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    try {
      await updateAppointmentStatus(appointmentId, 'cancelled')
      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      )
    } catch (error) {
      alert('Failed to cancel appointment')
    }
  }

  const now = new Date()
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.start_time) >= now && apt.status !== 'cancelled'
  )
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.start_time) < now || apt.status === 'cancelled' || apt.status === 'completed'
  )

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

  const getConsultationIcon = (type: string) => {
    if (type.includes('virtual')) return <Video className="w-4 h-4" />
    if (type.includes('home')) return <HomeIcon className="w-4 h-4" />
    return <MapPin className="w-4 h-4" />
  }

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: AppointmentWithPractitioner, showActions?: boolean }) => (
    <Card className="card-enhanced">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={appointment.practitioner.practitioners.profile_picture_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(appointment.practitioner.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {appointment.practitioner.full_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {appointment.practitioner.practitioners.specialty}
                </p>
              </div>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(appointment.start_time)}
              </div>
              <div className="flex items-center">
                {getConsultationIcon(appointment.type)}
                <span className="ml-2">{appointment.type}</span>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="font-medium">Time:</span> {formatTime(appointment.start_time)}
              </div>
            </div>

            {showActions && appointment.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/practitioner/${appointment.practitioner.id}`}>
                    View Practitioner
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleCancelAppointment(appointment.id)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <ProtectedRoute requiredRole="patient">
        <MainLayout>
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="patient">
      <MainLayout>
        <div className="bg-leaf-pattern py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="text-primary">{profile?.full_name}</span>!
            </h1>
            <p className="text-muted-foreground">
              Manage your appointments and healthcare journey
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Upcoming Appointments</h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have any upcoming appointments scheduled
                    </p>
                    <Button asChild>
                      <Link href="/search">Find a Practitioner</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Past Appointments</h3>
                    <p className="text-muted-foreground">
                      Your appointment history will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

